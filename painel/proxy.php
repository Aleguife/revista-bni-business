<?php
/**
 * proxy.php — Proxy server-side para a API da Anthropic
 *
 * Resolve o bloqueio de CORS ao chamar api.anthropic.com diretamente
 * do browser. O browser chama este arquivo (mesmo domínio), e este
 * faz o curl para a Anthropic com as credenciais recebidas.
 *
 * Recebe (POST):
 *   Header x-api-key: sk-ant-...
 *   Body JSON: { model, max_tokens, messages }
 *
 * Retorna:
 *   JSON da resposta da Anthropic com o mesmo HTTP status code.
 */

// ── CORS ─────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-api-key');

// Preflight OPTIONS — responde e encerra
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Validação do método ───────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => ['message' => 'Method not allowed']]);
    exit;
}

// ── Lê o body ────────────────────────────────────────────────
$body = file_get_contents('php://input');
if (!$body) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => ['message' => 'Empty request body']]);
    exit;
}

// ── Obtém a API key (header x-api-key ou campo api_key no body) ──
$apiKey = '';

$requestHeaders = getallheaders();
// getallheaders() pode retornar chaves em capitalização variada
foreach ($requestHeaders as $name => $value) {
    if (strtolower($name) === 'x-api-key') {
        $apiKey = trim($value);
        break;
    }
}

// Fallback: api_key no body (remove antes de repassar)
if (!$apiKey) {
    $data = json_decode($body, true);
    if (!empty($data['api_key'])) {
        $apiKey = trim($data['api_key']);
        unset($data['api_key']);
        $body = json_encode($data);
    }
}

if (!$apiKey) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => ['message' => 'Missing x-api-key header or api_key field']]);
    exit;
}

// ── Curl para a Anthropic ─────────────────────────────────────
$ch = curl_init('https://api.anthropic.com/v1/messages');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// ── Erro de curl (rede, DNS, timeout) ────────────────────────
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => ['message' => 'Proxy curl error: ' . $curlError]]);
    exit;
}

// ── Repassa a resposta da Anthropic ──────────────────────────
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
