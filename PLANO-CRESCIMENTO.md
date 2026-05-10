# Plano de Crescimento — Revista BNI Business

**Versão 1.0 — 10/05/2026**

Documento mestre com as 5 frentes de trabalho para transformar o site em ativo comercial mensurável. Imprima, marque, traga pra reunião.

---

## Sumário

1. [O que estamos construindo e por quê](#1-o-que-estamos-construindo-e-por-que)
2. [Frente 1 — Mensuração (fundação)](#frente-1--mensuracao)
3. [Frente 2 — SEO técnico (tráfego orgânico)](#frente-2--seo-tecnico)
4. [Frente 3 — Newsletter como ativo](#frente-3--newsletter-como-ativo)
5. [Frente 4 — Distribuição e impulsionamento](#frente-4--distribuicao)
6. [Frente 5 — Media kit comercial](#frente-5--media-kit-comercial)
7. [Cronograma sugerido (8 semanas)](#cronograma-sugerido)
8. [Templates prontos](#templates-prontos)
9. [Glossário rápido](#glossario)

---

## 1. O que estamos construindo e por quê

A Revista BNI Business é uma publicação editorial premium. O site não é vitrine institucional — é **ativo comercial mensurável**.

A proposta de valor que justifica vender espaço na Edição 3 a um ticket maior é:

> "Garantimos visibilidade qualificada, mensurável e duradoura para o membro que aparece na revista — antes da impressão começar a circular, e por anos depois."

Pra sustentar essa promessa, precisamos:

- **Medir o impacto** (cada matéria gera quantos contatos? quantas leituras? quantos compartilhamentos?)
- **Crescer a audiência orgânica** (SEO + newsletter + redes)
- **Provar isso comercialmente** (media kit com números reais)

As 5 frentes a seguir constroem essa base. A ordem importa: sem mensuração, as outras frentes ficam no escuro.

---

## Frente 1 — Mensuração

### O que é

Implementar rastreamento detalhado dos eventos mais importantes de cada matéria via Google Analytics 4 (GA4), e criar relatório mensal por matéria.

### Por que importa (argumento comercial)

Hoje você diz para o membro: "Sua matéria foi publicada no site". Isso é fraco.

Com mensuração, você diz: "Sua matéria gerou 1.247 leituras nos primeiros 30 dias, 89 cliques no botão WhatsApp, 34 compartilhamentos no LinkedIn, e tempo médio de leitura de 3min42s. O custo equivalente em mídia paga seria R$ X."

Esse é o argumento que fecha venda da Edição 3 a ticket 2-3x maior.

### Como implementar (passo a passo)

**Passo 1.1 — Criar `assets/js/analytics-events.js`**

Arquivo único que escuta cliques globais e dispara eventos GA4. Eventos a capturar:

- `cta_click` — clique em botão de WhatsApp/Instagram/site na seção CTA
- `share_click` — clique em botão de compartilhamento (header, footer, sidebar)
- `read_complete` — leitor chegou a 90% da matéria (já temos o cálculo no reading-circle)
- `outbound_link` — clique em qualquer link externo dentro da matéria
- `scroll_depth` — pontos de scroll (25%, 50%, 75%, 100%) — diagnóstica onde o leitor abandona

Cada evento envia parâmetros úteis: nome da matéria, edição, idioma, canal (whatsapp/instagram/etc).

**Passo 1.2 — Carregar o script em todas as matérias**

Adicionar `<script src="/assets/js/analytics-events.js?v=1" defer></script>` no `<head>` ao lado do `materia.js`. Bumpar versão a cada edição.

**Passo 1.3 — Configurar conversões no GA4**

Em GA4 → Admin → Eventos → Marcar como conversão:
- `cta_click` (mais importante — equivale a "lead gerado")
- `read_complete` (engajamento profundo)
- `share_click` (viralização)

**Passo 1.4 — UTMs nos QR codes da revista impressa**

Toda vez que a revista impressa for pra gráfica, os QR codes que apontam pro site precisam ter UTM:

```
https://bnibusiness.com.br/edicao-02/felipe-xavier/?utm_source=impresso&utm_medium=qr&utm_campaign=ed02
```

Isso permite separar tráfego que vem da revista física vs. busca orgânica vs. redes sociais.

**Passo 1.5 — Looker Studio (Google Data Studio)**

Criar dashboard gratuito conectado ao GA4 com filtro por matéria. Em 5 minutos você gera o relatório do membro.

Layout sugerido (1 página):
- Título da matéria + foto
- Período: últimos 30 dias
- 4 métricas grandes: visualizações / tempo médio / cliques no CTA / compartilhamentos
- Gráfico de leituras por dia
- Origem do tráfego (impresso / orgânico / social / direto)
- Top 5 dispositivos / cidades

**Passo 1.6 — Processo mensal**

Todo dia 1 do mês: exportar relatório de cada matéria publicada e enviar PDF ao membro entrevistado, com mensagem do tipo:

> "Olá [Nome], segue o relatório de performance da sua matéria nos últimos 30 dias. Os dados ajudam a mostrar o alcance real da revista para sua rede."

Esse gesto sozinho transforma a relação com o membro. Ele passa de "saí na revista" pra "tenho parceiro de marketing".

### Métricas de sucesso

- **Mês 1**: tracking ativo, primeiros números coletados
- **Mês 3**: dashboard pronto, primeiros relatórios mensais enviados
- **Mês 6**: você tem média de cliques-pra-WhatsApp por matéria → isso entra no media kit

---

## Frente 2 — SEO técnico

### O que é

Garantir que o Google indexe rapidamente cada nova matéria, mostre as 3 versões de idioma corretamente, e priorize o site em buscas relevantes.

### Por que importa

70-80% do tráfego de longo prazo de uma publicação editorial vem de busca orgânica. Cada matéria bem indexada vira "ativo perpétuo" — gera leitura por anos sem custo recorrente.

Em escala: 16 matérias × 3 idiomas × 100 leituras orgânicas/mês = 4.800 leituras/mês de graça. Em 12 meses, 57.600 leituras. Isso é argumento comercial.

### Como implementar

**Passo 2.1 — Automatizar sitemap.xml**

Criar `scripts/gerar-sitemap.js` (Node.js simples) que:
1. Lê `sumario.js` (constante `SUMARIOS`)
2. Lê `painel/admin.js` (constante `MATERIAS_POR_EDICAO`)
3. Gera `sitemap.xml` completo com 3 entradas por matéria (PT/EN/ES) + hreflang correto

Comando: `node scripts/gerar-sitemap.js`

Rodar antes de cada deploy. Ou automatizar via GitHub Action (gera sitemap a cada push).

**Passo 2.2 — Atualizar `dateModified` no JSON-LD**

Hoje o JSON-LD tem `datePublished` mas `dateModified` não atualiza. Adicionar campo `<meta name="last-modified">` ou popular automaticamente quando o painel publicar uma edição.

Solução: no painel, ao salvar matéria pela 2ª+ vez, atualizar `dateModified` pro dia atual.

**Passo 2.3 — Submeter sitemap em 3 lugares**

1. **Google Search Console** — https://search.google.com/search-console
   - Adicionar propriedade `bnibusiness.com.br`
   - Em Sitemaps → adicionar `sitemap.xml`
   - Verificar Indexação semanalmente
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   - Mesmo processo. Bing traz tráfego B2B relevante (executivos usam Edge)
3. **IndexNow** (opcional, avançado) — protocolo que notifica Bing/Yandex em tempo real quando publica matéria nova

**Passo 2.4 — Otimização de imagens (PageSpeed)**

CLAUDE.md já lista 4 heros pesados (>200KB) que precisam recompressão. Cada matéria nova precisa:

- Hero em WebP, alvo 130-150KB (qualidade 78 em squoosh.app)
- Resolução máxima 1920×1280
- `<img loading="lazy">` em todas exceto hero (que tem `loading="eager"` e `fetchpriority="high"`)
- `og-cover.webp` 1200×630 dedicado para Open Graph

PageSpeed Insights mobile ≥ 85 é a meta.

**Passo 2.5 — Backlinks (campanha contínua)**

Cada entrevistado tem site, LinkedIn e provavelmente parcerias. Cada citação digital ("conforme reportagem da Revista BNI Business") é um backlink.

Processo: 7 dias após publicação, enviar mensagem ao entrevistado:

> "Olá [Nome], a matéria está rodando bem. Compartilho o link novamente caso queira citar no seu site/LinkedIn — isso ajuda a fortalecer o posicionamento da matéria nas buscas e amplia o alcance pra sua rede também."

Anexar o link da matéria + sugestão de texto curto pra LinkedIn.

**Passo 2.6 — Rich Results e Schema avançado**

Já temos Schema.org Article. Pode acrescentar:

- `Person` para o entrevistado (com `jobTitle`, `worksFor`)
- `Organization` para a empresa entrevistada
- `BreadcrumbList` (caminho Home → Edição → Matéria)
- `FAQPage` quando a matéria tiver tópicos em pergunta-resposta

Isso ativa "rich snippets" no Google — o card maior com foto/avaliação/breadcrumb.

### Métricas de sucesso

- **Mês 1**: sitemap automatizado, Search Console e Bing configurados
- **Mês 3**: 80% das matérias indexadas, 20+ palavras-chave aparecendo em busca
- **Mês 6**: tráfego orgânico passa a representar 30%+ das visitas

---

## Frente 3 — Newsletter como ativo

### O que é

Transformar a newsletter de "campo no rodapé" em motor de retenção. Newsletter é a única audiência que você possui (não depende de algoritmo).

### Por que importa

- **Distribuição garantida** — mandou email, audiência viu (vs. Instagram que mostra 3% dos seguidores)
- **Métrica vendável** — "X mil empresários no mailing" entra no media kit
- **Custo zero** por envio (até certo limite no ConvertKit)
- **Reativação fácil** quando sair edição nova

Meta inicial: 500 inscritos em 3 meses.

### Como implementar

**Passo 3.1 — Lead magnet contextual no meio da matéria**

Hoje o opt-in está no rodapé (converte ~0.5%). Adicionar caixa de captura **após o 3º parágrafo** ou no meio da matéria.

Exemplo de copy:

> **Curtindo a leitura?**
> Receba a próxima edição antes de todo mundo. Email semanal com a melhor matéria, insight da próxima edição e bastidores. Sem spam.
> [campo de email] [botão: QUERO RECEBER]

Posicionamento estratégico: depois da pessoa já se engajou (3 parágrafos = 30s de leitura), a barreira psicológica do email é menor. Conversão típica: 2-5%.

**Passo 3.2 — Sequência de boas-vindas (3 emails automáticos no ConvertKit)**

Quando alguém assina:

**Email 1 (imediato) — Boas-vindas**
- Apresenta o que esperar (1 email semanal)
- Linka 1 matéria emblemática (Felipe Xavier — capa)
- Convida a responder com qual setor o leitor atua → você qualifica a base
- CTA: seguir Instagram da revista

**Email 2 (3 dias depois) — Quem somos**
- O que é o BNI, o que é a revista
- Por que ela existe
- Linka mais 2 matérias relevantes (variedade de setores)
- Convite a conhecer o BNI

**Email 3 (7 dias depois) — Convite institucional**
- Story do que a Revista entrega para os membros (números, alcance)
- Convite a participar de uma reunião visitante do BNI
- CTA: agendar visita / conversar com o BNI

**Passo 3.3 — Email mensal de curadoria**

Toda primeira segunda-feira do mês:

- Subject: "As 3 matérias mais lidas em [mês]"
- Top 3 matérias do mês com 1-linha de teaser cada
- 1 insight da próxima edição (gera expectativa)
- 1 chamada comercial sutil ("conheça o BNI" ou "anuncie na próxima edição")

Esse email é o que mantém a base "morna". Quem abre 3+ vezes seguidas é lead quente pro BNI ou pra anunciar.

**Passo 3.4 — Segmentação básica**

ConvertKit suporta tags. Criar tags:
- `setor:tecnologia`, `setor:saude`, etc (preenchido pela resposta do email 1)
- `engajamento:alto` (abriu últimos 5 emails)
- `interesse:visitar-bni`, `interesse:anunciar`

Quando rodar a venda da Ed.3, dispara campanha só para `interesse:anunciar` + `engajamento:alto`. Conversão muito maior que email genérico.

**Passo 3.5 — Métricas que importam**

- **Taxa de assinatura** (visitantes únicos → assinantes) — meta: 2-5%
- **Open rate** — meta: 35-45% (mercado: 20-25%)
- **Click rate** — meta: 8-12%
- **Crescimento mensal da lista** — meta: +15% ao mês

### Métricas de sucesso

- **Mês 1**: lead magnet no meio da matéria, sequência de boas-vindas no ar
- **Mês 3**: 500+ inscritos, primeiro email de curadoria enviado
- **Mês 6**: 1.500+ inscritos, segmentação ativa

---

## Frente 4 — Distribuição

### O que é

Conteúdo bom sem distribuição é desperdício. Esta frente é sobre canais ativos: redes sociais, parceiros, mídia paga.

### Por que importa

Você publica matéria de qualidade no site. E aí? Sem distribuição, leva semanas pra ela ranquear no Google. Com distribuição ativa, em 24h ela tem 1.000+ leituras.

Distribuição ativa também é o que justifica orgulhoso o "alcance médio por matéria" no media kit.

### Como implementar

**Passo 4.1 — LinkedIn da Revista (perfil próprio)**

Criar página da Revista BNI Business no LinkedIn (não usar perfil pessoal nem só do BNI).

Cadência mínima: 2 posts/semana.

Formatos que funcionam:
- **Carrossel** (10 slides) com trecho da matéria + foto + link no comentário (LinkedIn pune link no post principal)
- **Citação destacada** — frase forte da matéria + foto do entrevistado + link nos comentários
- **Bastidores** — foto do produto físico, cobertura de evento, "vem aí Ed.3"
- **Vídeo curto (60s)** — entrevistado falando 1 frase forte da matéria

Métrica: alcance médio por post + cliques pro site. Meta inicial: 500 alcance/post.

**Passo 4.2 — Kit pronto para o membro entrevistado**

Cada membro entrevistado recebe (24h antes da publicação):

- Texto pronto pra LinkedIn (3 versões de tamanho)
- Texto pronto pra Instagram (post + story)
- 3 imagens já com a marca da revista (16:9, 4:5, 9:16)
- Link da matéria
- Sugestão de hashtags
- Checklist de "marque a Revista BNI nos posts"

Envia tudo num email com subject "Materiais de divulgação da sua matéria — pronto pra postar".

Membro feliz + alcance multiplicado pelos contatos dele = win-win.

**Passo 4.3 — Impulsionamento pago (Meta Ads)**

Começar pequeno: R$ 30-50/dia em Instagram + Facebook Ads.

Configuração inicial:
- **Objetivo**: tráfego pra matéria (não conversão ainda — não temos pixel maturo)
- **Público**: donos/sócios de empresa, SP capital + grande SP, 30-55 anos, interesses: empreendedorismo, business, gestão
- **Criativo**: foto do entrevistado + frase forte + "Leia a matéria"
- **Lance**: começar com lance automático

Roda 5 dias. Mede CPM, CTR, CPC. Identifica qual matéria/criativo performa melhor. Escala apenas o que funciona.

Em 30 dias, você tem dados de "custo por clique pra cada tipo de conteúdo" — vira benchmark interno e argumento comercial.

**Passo 4.4 — Google Search Console + Bing Webmaster Tools**

Já mencionado na Frente 2. Aqui o foco é o **uso ativo**, não só configurar:

- Toda semana abrir o Search Console
- Olhar "Desempenho" — quais queries trazem tráfego
- Olhar "Indexação" — alguma matéria não indexou?
- Olhar "Experiência > Core Web Vitals" — alguma matéria está lenta?

15 minutos/semana resolve.

**Passo 4.5 — Parcerias estratégicas**

Identificar 5-10 portais/influenciadores de business em SP que poderiam co-distribuir conteúdo. Exemplos:

- Blogs de aceleradoras (Endeavor, Sebrae)
- Newsletters de business locais
- Influenciadores de LinkedIn especializados em PMEs
- Câmaras de comércio

Aproximação: oferecer 1 matéria exclusiva pra co-publicação OU tela de divulgação cruzada.

### Métricas de sucesso

- **Mês 1**: LinkedIn ativo (8 posts), kit pra membros pronto, primeira campanha paga rodando
- **Mês 3**: 2.000 seguidores no LinkedIn, R$ 1.000-2.000/mês em ads com ROI mensurado
- **Mês 6**: alcance combinado (orgânico + pago + parceiros) de 50.000+ pessoas/mês

---

## Frente 5 — Media kit comercial

### O que é

Documento de 4-8 páginas em PDF que você leva pra reunião de venda da Edição 3. Concentra todos os números das frentes anteriores num argumento visual e direto.

### Por que importa

Sem media kit, venda é argumentativa ("a revista é prestigiosa…"). Com media kit, é numérica ("a revista entrega X impressões médias por matéria, Y cliques de contato direto, Z mil pessoas no mailing").

Numérico vence argumentativo. Toda vez.

### Como implementar

**Passo 5.1 — Coletar dados (a partir do mês 3)**

Você só consegue fazer media kit quando tem dados das outras frentes. Não pule.

Dados a coletar (média mensal das matérias com 30+ dias no ar):
- Visualizações por matéria
- Tempo médio de leitura
- % que rola até o final
- Cliques no CTA (WhatsApp/Instagram do entrevistado)
- Compartilhamentos
- Origem do tráfego (% busca, % social, % impresso, % direto)
- Tamanho da newsletter
- Taxa de abertura média
- Seguidores LinkedIn + Instagram
- Alcance orgânico médio

**Passo 5.2 — Estrutura do media kit (1 PDF)**

**Capa**
- Logo Revista BNI Business
- "Media Kit 2026" / "Edição 3"

**Página 1 — Quem somos**
- 1 parágrafo: o que é a Revista
- 3 números grandes: edições publicadas, matérias no ar, leitores impactados
- 1 frase do BNI sobre a importância da revista

**Página 2 — Audiência**
- Persona: dono/sócio de PME, SP capital, 30-55, ticket médio R$ X
- Distribuição geográfica (mapa)
- Distribuição por setor
- Distribuição por idioma (PT/EN/ES — argumento internacional)

**Página 3 — Performance digital**
- Visualizações médias por matéria (mês 1, mês 3, mês 12)
- Tempo médio de leitura
- Taxa de leitura completa (90%+)
- Print do gráfico GA4 mais bonito

**Página 4 — Distribuição**
- Newsletter: X mil inscritos, Y% open rate
- LinkedIn: Z mil seguidores, alcance médio W mil
- Instagram: A mil seguidores
- Impulsionamento: B mil impressões pagas/mês

**Página 5 — Prova social**
- Logos de membros que já apareceram
- 3-4 depoimentos curtos
- Print do post mais engajado
- Métrica destacada: "Em média, cada matéria gera N contatos diretos para o membro"

**Página 6 — Pacotes comerciais**
- Pacote básico (matéria padrão)
- Pacote intermediário (matéria + impulsionamento + relatório premium)
- Pacote premium (matéria de capa + tudo)
- Tabela visual com "o que está incluso em cada"

**Página 7 — Próximos passos**
- Calendário editorial Ed.3
- Datas de fechamento comercial
- Contato

**Passo 5.3 — Versionar trimestralmente**

Atualizar a cada 3 meses com números mais recentes. Versão sempre disponível em PDF + landing page exclusiva (`/midia-kit/`) protegida por senha que é dada na 1ª reunião.

**Passo 5.4 — Apresentação curta (1 slide)**

Versão de 1 slide do media kit pra usar em reunião quando não há tempo de mostrar PDF inteiro:

- 4 quadrantes: Audiência / Performance / Distribuição / Prova social
- 4 números grandes (1 por quadrante)
- 1 chamada de ação

### Métricas de sucesso

- **Mês 4**: primeira versão do media kit pronta
- **Mês 6**: primeira venda da Ed.3 fechada usando o media kit
- **Mês 9**: ticket médio da Ed.3 cresce X% vs. Ed.2

---

## Cronograma sugerido

Plano de 8 semanas, 2 frentes ativas em paralelo:

### Semana 1-2 — Fundação
- [ ] Frente 1: implementar `analytics-events.js` + tracking de CTAs/share/scroll
- [ ] Frente 2: criar script de geração automática do sitemap
- [ ] Frente 2: configurar Google Search Console + Bing Webmaster Tools

### Semana 3-4 — Captura
- [ ] Frente 1: dashboard Looker Studio configurado
- [ ] Frente 3: lead magnet contextual no meio das matérias
- [ ] Frente 3: sequência de boas-vindas (3 emails) no ConvertKit
- [ ] Frente 4: criar página LinkedIn da Revista + primeiros 4 posts

### Semana 5-6 — Distribuição
- [ ] Frente 4: kit pronto pra entrevistados (textos + imagens + checklist)
- [ ] Frente 4: primeira campanha Meta Ads (R$ 50/dia × 5 dias)
- [ ] Frente 1: primeiro relatório mensal enviado a 3 membros (teste)
- [ ] Frente 3: primeiro email de curadoria mensal

### Semana 7-8 — Comercial
- [ ] Frente 2: campanha de backlinks com membros publicados
- [ ] Frente 4: identificar 5 parcerias estratégicas e abordar
- [ ] Frente 5: começar a montar primeira versão do media kit
- [ ] Revisão geral: ajustar o que não está funcionando

### Mês 3 em diante — Otimização contínua
- [ ] Media kit v1 finalizado
- [ ] Primeiro pitch comercial Ed.3 com media kit
- [ ] Otimização baseada em dados (A/B test em CTAs, copy de email, criativos de ads)

---

## Templates prontos

### Template 1 — Mensagem ao membro 7 dias após publicação (backlinks)

```
Olá [Nome],

A matéria sobre [tema] está rodando bem na revista digital — já tivemos
[N] visualizações nos primeiros 7 dias.

Queria reforçar uma sugestão: se quiser, você pode citar/linkar a matéria
no seu site, LinkedIn ou em apresentações comerciais. Isso fortalece a
posição dela nas buscas e amplia o alcance pra sua rede também.

Link: https://bnibusiness.com.br/edicao-02/[slug]

Sugestão de texto curto pra LinkedIn:

"Acabei de sair na Revista BNI Business falando sobre [tema]. Foi uma
honra contar essa história ao lado de [empresa]. Quem quiser ler:
[link]"

Qualquer dúvida, estou aqui.

[Seu nome]
```

### Template 2 — Email kit de divulgação ao membro (24h antes da publicação)

```
Assunto: Materiais de divulgação da sua matéria — pronto pra postar

Olá [Nome],

Sua matéria entra no ar amanhã às [hora]. Preparei tudo que você precisa
pra divulgar pra sua rede:

1. LINK DA MATÉRIA
https://bnibusiness.com.br/edicao-02/[slug]

2. TEXTOS PRONTOS

LinkedIn (versão longa — 3 parágrafos): [anexar]
LinkedIn (versão curta — 1 parágrafo): [anexar]
Instagram post: [anexar]
Instagram story: [anexar]
WhatsApp status: [anexar]

3. IMAGENS COM MARCA DA REVISTA
Instagram feed (1080×1350): [anexar arquivo]
Instagram story (1080×1920): [anexar arquivo]
LinkedIn post (1200×627): [anexar arquivo]

4. SUGESTÃO DE HASHTAGS
#bnibusiness #empreendedorismo #[setor] #saopaulo

5. PEDIDO ESPECIAL
Quando postar, marque a Revista BNI Business (@revistabnibusiness no
Instagram, /company/revista-bni-business no LinkedIn). Isso ajuda muito
no alcance.

Qualquer dúvida me chama no WhatsApp.

[Seu nome]
```

### Template 3 — Email 1 da sequência de boas-vindas

```
Assunto: Bem-vindo à Revista BNI Business

Olá,

Que bom ter você aqui. Acabou de assinar a newsletter da revista que
mostra histórias reais de quem empreende em São Paulo — sem fórmulas
mágicas, sem clichês.

Pra começar, indico esta matéria que abriu a Edição 2:

[Felipe Xavier: o estrategista por trás da nova geração de obras]
https://bnibusiness.com.br/edicao-02/materia-de-capa

(11 minutos de leitura — vale cada um deles)

QUERO TE FAZER UMA PERGUNTA RÁPIDA
Qual setor você atua? Responda este email com uma palavra
(tecnologia / serviços / indústria / saúde / outros).

Isso me ajuda a mandar conteúdo mais relevante pra você.

Até semana que vem,
[Seu nome]
Revista BNI Business

P.S. Você também pode nos seguir no Instagram (@revistabnibusiness) e
no LinkedIn — lá publicamos os bastidores de cada edição.
```

### Template 4 — Texto LinkedIn pra publicação de matéria (versão curta)

```
[Frase forte da matéria entre aspas, máximo 2 linhas]

Foi essa a frase de [Nome do entrevistado], fundador da [Empresa],
que conduziu nossa última conversa.

A matéria completa está fora hoje na Revista BNI Business —
link no primeiro comentário.

[Foto do entrevistado, 1200×627]

#bnibusiness #empreendedorismo #[setor]
```

### Template 5 — Carrossel LinkedIn da Revista (10 slides)

```
Slide 1 (capa): Frase forte da matéria + foto entrevistado + título
Slide 2: Apresentação curta do entrevistado
Slide 3-7: Cinco insights/momentos-chave da matéria (1 por slide)
Slide 8: Citação direta + foto
Slide 9: Convite "Leia a matéria completa"
Slide 10: Call-to-action — assine a newsletter / siga a revista
```

---

## Glossário rápido

- **CTR (Click-Through Rate)** — % de pessoas que clicam num link/CTA
- **CPM (Custo por Mil Impressões)** — quanto custa mostrar anúncio pra 1.000 pessoas
- **CPC (Custo por Clique)** — quanto custa cada clique no anúncio
- **Open Rate** — % de pessoas que abrem o email
- **Bounce Rate** — % de visitantes que saem sem clicar em nada
- **GA4** — Google Analytics 4, sistema de medição
- **Schema.org / JSON-LD** — código que ajuda Google a entender a página
- **Hreflang** — tag que indica versão de idioma da mesma página
- **Backlink** — outro site linkando pro seu (vital pra SEO)
- **Lead Magnet** — oferta que captura email do visitante
- **Funil** — caminho que o visitante percorre até virar cliente
- **UTM** — parâmetro na URL que rastreia origem do tráfego
- **Conversão** — ação valiosa do visitante (clique no CTA, assinar newsletter, etc)
- **PageSpeed** — velocidade de carregamento, ferramenta do Google que mede

---

## Resumo executivo (pra colar na parede)

| Frente | Esforço | Impacto | Quando começa |
|--------|---------|---------|---------------|
| 1. Mensuração | Médio | Alto | Semana 1 |
| 2. SEO técnico | Baixo | Alto | Semana 1 |
| 3. Newsletter | Médio | Alto | Semana 3 |
| 4. Distribuição | Alto | Alto | Semana 3 |
| 5. Media kit | Baixo | Crítico | Semana 7 |

**Investimento estimado:**
- Tempo: 4-8h/semana suas + sessões pontuais comigo
- Dinheiro: R$ 1.500-3.000/mês em mídia paga (depois do mês 2, opcional)
- Ferramentas: tudo que precisa já está contratado (GA4, ConvertKit, hospedagem)

**Resultado esperado em 6 meses:**
- Tráfego orgânico crescendo 20-40%/mês
- 1.500+ assinantes na newsletter
- 3.000+ seguidores LinkedIn
- Media kit com números reais pra fechar Ed.3
- Ticket médio da Ed.3 +30-50% vs. Ed.2

---

*Documento mantido pelo Claude Code. Versão atualizada: PLANO-CRESCIMENTO.md no repositório.*
