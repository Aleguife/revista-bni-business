# CLAUDE.md — Revista BNI Business

Contexto permanente do projeto para o Claude Code.
Leia este arquivo inteiro antes de qualquer ação.

---

## Visão geral

**Revista BNI Business** é uma publicação editorial premium do BNI São Paulo.
Site estático em HTML/CSS/JS puro, hospedado na Locaweb, deploy automático via GitHub Actions.

- **Repositório:** `Aleguife/revista-bni-business`
- - **Domínio:** `bnibusiness.com.br`
  - - **Branch principal:** `main` (deploy automático ao commitar)
    - - **Stack:** HTML5 semântico, CSS3, JS vanilla — sem frameworks, sem build tools
     
      - ---

      ## Identidade visual

      | Token | Valor |
      |-------|-------|
      | Vermelho principal | `#CC0000` |
      | Preto | `#111111` |
      | Branco | `#ffffff` |
      | Bege (fundo) | `#f5f4f2` |
      | Fonte título | Playfair Display 700 (Google Fonts) |
      | Fonte corpo | DM Sans 400/500 (Google Fonts) |

      Retrancas de seção sempre em `#CC0000`. Títulos em Playfair Display. Corpo em DM Sans.

      ---

      ## Edição 2 — Status das 16 matérias

      | # | Seção | Profissional / Empresa | Slug | Status |
      |---|-------|----------------------|------|--------|
      | 1 | Eventos | Cigar Night — Rodrigo Motta | cigar-night | no ar |
      | 2 | Case de sucesso | Magna Marinho / ELA | magna-marinho | pendente |
      | 3 | Case de sucesso | José Roberto Teixeira / JRT Print | jose-roberto-teixeira | pendente |
      | 4 | Matéria de Capa | Felipe Xavier / Redax Engenharia | felipe-xavier | no ar |
      | 5 | Editorial | O impresso que o digital não substitui | o-impresso | pendente |
      | 6 | Negócios | Up Brasil / Mariana Cerone | up-brasil | pendente |
      | 7 | Saúde mental | Tonos / Elisa de Lima | tonos | pendente |
      | 8 | Direito | AposentaSP / Dra. Simone Baptista | aposentasp | pendente |
      | 9 | Estilo | MSR Device Golden / Anderson Oliveira | msr-golden | pendente |
      | 10 | BNI Mundi | WPO Languages / Waldir Pires | bni-mundi | pendente |
      | 11 | Reconhecimento | Evento BNI OESP | reconhecimento | pendente |
      | 12 | Desenvolvimento pessoal | Massaru Ogata / IFT | massaru-ogata | pendente |
      | 13 | Eventos 2 | Salleven / Carla Sallada | salleven | pendente |
      | 14 | Turismo | Monaco / Convencao BNI 2026 | monaco | pendente |
      | 15 | Negócios 2 | FIA Business School | fia-business-school | pendente |
      | 16 | BNI São Francisco | BNI São Francisco | bni-sao-francisco | pendente |

      Atualizar este arquivo ao publicar cada matéria.

      ---

      ## Regras de desenvolvimento

      1. Nunca usar frameworks — HTML/CSS/JS puro apenas
      2. 2. Cache busting — ao editar nav.js ou footer.js, incrementar v=N em todas as páginas
         3. 3. Slugs em kebab-case — sempre minúsculas, sem acentos, hífens entre palavras
            4. 4. Caminho das imagens — sempre relativo à raiz: /edicao-02/[slug]/hero.jpg
               5. 5. Commits em português — ex: feat: adiciona matéria magna-marinho
                  6. 6. Uma pasta por matéria — edicao-02/[slug]/index.html
                     7. 7. Preservar HTML do texto — nunca remover tags b, i, u, ul, ol, h2 do texto original
                        8. 8. Atualizar CLAUDE.md ao publicar cada matéria
                          
                           9. ---
                          
                           10. ## Admin CMS
                          
                           11. Painel em /admin/ para criação de matérias via browser.
                           12. - Login com senha hasheada SHA-256
                               - - Formulário com todos os campos da matéria
                                 - - Geração de HTML via Claude API modelo claude-sonnet-4-20250514
                                   - - Publicação direta via GitHub API sem terminal
                                     - - Checklist integrado das 16 matérias
                                      
                                       - ---

                                       ## Próximas fases

                                       - Edição 2: publicar as 14 matérias restantes
                                       - - Página índice /edicao-02/ com grid das 16 matérias
                                         - - Home com grid de edições após Ed.1 e Ed.2 concluídas
                                           - - Edição 1: digitalizar retroativamente
                                             - - Templates A hero vertical e B hero horizontal
