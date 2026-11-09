# Criar títulos — Tema aprovado e nicho do canal

Método do Processo **Título**, contrato v3, versão editorial inicial 1.0.0. Criado para o checkout ContentFlow 1.3.7. Usa a saída oficial de Tema e os dados do Canal para produzir alternativas originais e entregar um título escolhido e aprovado pelo criador.

## Importação e configuração

1. Em **Métodos → Importar Método**, selecione `criar-titulos.contentflow-method.json` e aplique ao Processo Título do Canal desejado. Revise a substituição caso já exista um Método nesse Processo.
2. Mantenha **Tema antes de Título** na ordem dos Processos. O Projeto precisa ter uma saída oficial de Tema concluída. O método de mineração criado anteriormente é compatível, mas qualquer Método que entregue o Tema canônico pode ser usado: a ligação não depende de seus nomes ou IDs de Bloco.
3. Instale e ative **ChatGPT Browser Studio**, com as capacidades `generate-text-in-browser` e `search-web-in-browser`. A versão local declarada e verificada é **2.0.2**. Vincule e prepare um perfil autenticado; selecione-o nos Blocos de IA.
4. Confira nome, nicho e idioma do Canal. No primeiro Bloco, personalize estilo, público, formato, mercado e restrições. Por padrão, o Método pede até 12 rascunhos, busca referências recentes em 90 dias e usa 70 caracteres como alvo editorial ajustável, sem afirmar que esse é o limite da plataforma.
5. Execute o Processo, escolha um dos títulos revisados e aprove o título final.

O arquivo não contém contas, perfis, credenciais ou caminhos locais. Nenhuma importação no Canal, instalação de plugin, chamada ao ChatGPT ou publicação é feita apenas pela criação deste arquivo.

## Fluxo e entregas

1. **CRIAR — Definir promessa e direção.** Recebe o Tema aprovado. Produz briefing com público, pergunta, promessa sustentada, limites, direções de títulos e consultas de pesquisa.
2. **BUSCAR — Pesquisar referências.** Recebe o briefing. Produz dossiê com títulos observados, URLs, datas, estruturas úteis, fórmulas saturadas e limitações da amostra.
3. **CRIAR — Criar títulos com ângulos diferentes.** Recebe Tema, briefing, referências e histórico. Produz rascunhos com justificativas, contagem de caracteres e riscos.
4. **CRIAR — Revisar e priorizar.** Recebe os materiais anteriores e histórico. Corrige/rejeita opções e entrega um relatório de comparação e até cinco títulos elegíveis. Cada item de seleção contém somente o título exato.
5. **VALIDAR / Humano — Escolher título.** Entrega um único texto escolhido. Rejeitar refaz a revisão com feedback, até três tentativas, preservando pesquisa e rascunhos.
6. **CRIAR — Registrar título final.** Recebe a escolha e a reproduz sem reescrever. Entrega `title`, texto único de uma linha, sem relatório, notas ou explicações.
7. **VALIDAR / Humano — Aprovar título final.** Confere fidelidade ao Tema e igualdade com o texto escolhido. Rejeitar pausa para corrigir a etapa apropriada; aprovar libera o resultado oficial.

As etapas preservam briefing, pesquisa, rascunhos e comparação para revisão e reutilização dentro do Projeto. A seleção é VALIDAR porque as opções foram criadas durante esta execução. Não é necessário cadastrar opções na Biblioteca Estratégica.

## Estratégia editorial

O título deve tornar o assunto específico compreensível, despertar uma pergunta relevante e sustentar sua promessa no Tema. Números, autoridades, urgência, superlativos e afirmações factuais só podem aparecer com suporte no conteúdo recebido. A pesquisa analisa estruturas e evita copiar títulos de concorrentes.

Depois de rejeitar promessas sem suporte, a revisão pontua os títulos elegíveis de 0 a 5 em cinco critérios:

- Fidelidade à promessa: 30%.
- Clareza imediata: 25%.
- Especificidade: 20%.
- Curiosidade honesta: 15%.
- Diferenciação frente às referências e ao histórico: 10%.

Total = soma de `peso × nota / 5`, de 0 a 100. O relatório mostra a conta e justificativas. São critérios editoriais ajustáveis, não previsões de CTR, alcance ou viralização. Views públicas não isolam o efeito do título.

O histórico consulta até **50 títulos registrados como concluídos**, do mesmo Canal, excluindo o Projeto atual. Histórico vazio é válido. Essa janela não equivale ao catálogo completo do YouTube e não elimina repetição entre Projetos simultâneos ainda sem título registrado.

Não é exigida Thumbnail ou Roteiro para executar. O briefing sugere apenas a intenção de complemento visual; os Métodos desses outros Processos permanecem independentes. Como o roteiro pode ser criado depois, confira novamente a promessa do título contra o conteúdo efetivamente produzido antes de publicar.

## Limites e intervenção

Se a pesquisa web estiver indisponível, o Método explicita a limitação e permite criar opções baseadas no Tema, sem alegar validação de mercado. Se o Tema estiver pendente ou não houver título elegível, mostra **PENDÊNCIA — SEM TÍTULO APROVÁVEL**, que deve ser rejeitada.

As contagens, notas, verificação de promessas e reprodução do título são instruções para IA, não validações semânticas determinísticas no núcleo. Por isso há escolha e aprovação humanas. O título final deve ser comparado ao escolhido; qualquer alteração exige correção antes da aprovação. O Método não instala automação de testes A/B nem publica ou modifica vídeos existentes.

As cinco etapas de IA enviam as entradas vinculadas ao ChatGPT. Disponibilidade, login, custos e cotas dependem do perfil e do provedor. Perfis são associados explicitamente no ambiente local.

## Validação local

O verificador `validate.ts` usa o parser/importador real, o validador do Builder e o manifesto local do plugin. Na verificação realizada:

- Envelope, contrato de importação, portas, ordem e ligações entre Blocos: aprovados sem erros ou avisos.
- Contrato nativo do Histórico do Canal: aprovado.
- Integração dos Métodos Tema e Título, com dependência na saída oficial: aprovada.
- Catorze resoluções de instruções, em dois Canais de nichos/idiomas diferentes: sem variáveis pendentes.
- Ligação quebrada e ordem Título antes de Tema: rejeitadas.
- Saída final canônica, requisitos portáteis e ausência de credenciais/perfis: verificados.

Essas verificações não executaram o ChatGPT nem a importação na interface. A estrutura importável foi validada; a execução com provedor autenticado continua pendente.

Para repetir em ambiente com dependências funcionais: `npx tsx ecosystem/methods/criar-titulos/validate.ts`. A opção `--write` normaliza e serializa o arquivo com as autoridades do projeto. Nesta sessão foi usado o mesmo carregador TypeScript temporário da validação do Método Tema, devido ao problema preexistente do esbuild local, sem alterar dependências.
