# Relatório HTTPS — Revista BNI Business

**Gerado em:** 2026-05-08

---

## 1. Resumo

| Métrica | Valor |
|---------|-------|
| Arquivos varridos | 69 |
| Ocorrências de `http://` encontradas | 5 |
| Ignoradas (namespaces SVG/XML) | 5 |
| Corrigidas automaticamente | 0 |
| Pendentes de revisão manual | 0 |

**Conclusão:** Nenhuma correção foi necessária. Todas as ocorrências de `http://` são namespaces SVG/XML padrão e devem permanecer exatamente como estão.

---

## 2. Correções automáticas aplicadas

Nenhuma correção necessária.

---

## 3. Pendentes de revisão manual

Nenhuma pendência.

---

## 4. Detalhamento das ocorrências ignoradas (namespaces SVG/XML)

As 5 ocorrências encontradas são todas atributos de namespace XML — tecnicamente não são URLs de recurso e **não devem ser alteradas**:

| Arquivo | Linha | Conteúdo |
|---------|-------|----------|
| `footer.js` | 13 | `xmlns="http://www.w3.org/2000/svg"` |
| `nav.js` | 44 | `xmlns="http://www.w3.org/2000/svg"` e `xmlns:xlink="http://www.w3.org/1999/xlink"` |
| `sumario.js` | 14 | `xmlns="http://www.w3.org/2000/svg"` e `xmlns:xlink="http://www.w3.org/1999/xlink"` |
| `sumario-en.js` | 12 | `xmlns="http://www.w3.org/2000/svg"` e `xmlns:xlink="http://www.w3.org/1999/xlink"` |
| `sumario-es.js` | 12 | `xmlns="http://www.w3.org/2000/svg"` e `xmlns:xlink="http://www.w3.org/1999/xlink"` |

> **Nota:** `xmlns` e `xmlns:xlink` são identificadores de namespace XML, não endereços de rede. Alterá-los para `https://` quebraria a validação dos SVGs inline.

---

## 5. Links internos absolutos (apenas informativo)

Os links `https://bnibusiness.com.br/...` presentes no projeto já usam `https://` corretamente. Eles aparecem em:

- Tags `<meta property="og:*">`, `<meta name="twitter:*">` — necessário absoluto para Open Graph / Twitter Cards.
- Tags `<link rel="canonical">`, `<link rel="alternate" hreflang="*">` — necessário absoluto por especificação.
- Blocos `<script type="application/ld+json">` (Schema.org) — necessário absoluto.
- Botões de compartilhamento (WhatsApp, LinkedIn, Facebook) — necessário absoluto para funcionar como links externos.
- `navigator.clipboard.writeText(...)` — necessário absoluto para copiar a URL completa.

**Ação recomendada:** manter todos como URLs absolutas. São usos corretos e intencionais.

---

*Nenhum arquivo foi modificado durante esta varredura.*
