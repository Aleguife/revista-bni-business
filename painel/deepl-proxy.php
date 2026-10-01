<?php
/**
 * Proxy temporário para a API do DeepL.
 * A chave chega somente na requisição do navegador e nunca é persistida.
 */
$allowedOrigins = [
    'https://bnibusiness.com.br',
    'https://www.bnibusiness.com.br',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-deepl-auth-key');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => ['message' => 'Method not allowed']]);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
$headers = getallheaders();
$authKey = '';
foreach ($headers as $name => $value) {
    if (strtolower($name) === 'x-deepl-auth-key') {
        $authKey = trim($value);
        break;
    }
}
$texts = $payload['text'] ?? [];
$target = strtoupper(trim($payload['target_lang'] ?? ''));
$tagHandling = !empty($payload['tag_handling']) ? 'html' : '';
if (!$authKey || !is_array($texts) || !$texts || !in_array($target, ['EN', 'ES'], true)) {
    http_response_code(400);
    echo json_encode(['error' => ['message' => 'Chave, textos ou idioma de destino inválidos.']]);
    exit;
}

$fields = 'target_lang=' . rawurlencode($target) . '&source_lang=PT';
if ($tagHandling) $fields .= '&tag_handling=html&preserve_formatting=1';
foreach (array_slice($texts, 0, 50) as $text) {
    if (is_string($text) && $text !== '') $fields .= '&text=' . rawurlencode($text);
}
$ch = curl_init('https://api-free.deepl.com/v2/translate');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $fields,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_HTTPHEADER => [
        'Authorization: DeepL-Auth-Key ' . $authKey,
        'Content-Type: application/x-www-form-urlencoded',
    ],
]);
$response = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);
if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => ['message' => 'Falha de conexão com o DeepL: ' . $error]]);
    exit;
}
http_response_code($code);
echo $response;
