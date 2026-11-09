# Pesquisar e minerar temas — Nicho do canal

Método para o Processo **Tema**, compatível com o contrato v3 do checkout ContentFlow 1.3.7. Versão editorial inicial: 1.0.0. Entrega um tema e briefing para um vídeo, mantendo plano, pesquisas, hipóteses e candidatos como entregas intermediárias do Projeto.

## Referência analisada

O [catálogo methods-contentflow](https://github.com/andremjr/methods-contentflow) consultado em 30/10/2026 oferece um Método de Assets Visuais: roteiro, personagens, referências, prompts, imagens, seleção e animação. Seu padrão útil é preservar intermediários, conectar explicitamente as etapas e separar curadoria de geração. O novo método aplica essa composição ao Processo Tema; não reutiliza os prompts de imagens nem depende do Flow.

A referência usa envelope v3 e plugins independentes, com associação local de perfis. Não é um mecanismo de mineração de temas já existente. Os critérios de pesquisa, comparação e priorização abaixo são a estratégia editorial criada para este pedido, ajustável no editor do Método.

Fontes: [README do catálogo](https://github.com/andremjr/methods-contentflow/blob/main/README.md) e [Método de imagens](https://github.com/andremjr/methods-contentflow/blob/main/methods/gerar-imagens-flow-assets.contentflow-method.json). A autoria do catálogo e do Método de referência pertence a André Carlos Lima Marinho Junior; a licença MIT da referência está preservada em `LICENSE-REFERENCIA`. A licença do núcleo ContentFlow permanece independente.

## Usar no ContentFlow

1. Abra **Métodos → Importar Método** e selecione `pesquisar-minerar-temas.contentflow-method.json` desta pasta. Confira a prévia e escolha o Canal e o Processo Tema. Se o Canal já possuir método nesse Processo, revise a substituição antes de aplicar.
2. Configure no Canal o **nome, nicho e idioma**. Essas informações são lidas a cada execução por variáveis nativas; não há nicho fixo no arquivo. O nome do Projeto serve apenas como pista opcional.
3. Instale/ative o plugin **ChatGPT Browser Studio** compatível com as capabilities `generate-text-in-browser` e `search-web-in-browser`. O arquivo declara a versão local verificada **2.0.2**. Vincule e prepare explicitamente um perfil autenticado e selecione-o nos Blocos. O pacote não transporta conta, perfil ou credenciais.
4. No primeiro Bloco, ajuste **Diretrizes adicionais** com público, país/mercado, formato, duração, recursos de produção, pilares e assuntos proibidos. Se não preenchidos, o método explicita hipóteses; ele não recebe automaticamente a descrição ou uma persona do Canal. Janela recente padrão: 90 dias. Teto padrão: 12 candidatos.
5. Inicie um Projeto com Tema como primeiro Processo ou antes de qualquer Processo que consuma seu resultado. Revise os candidatos na etapa 6 e aprove o briefing na etapa 8.

As seis etapas de IA enviam as entradas vinculadas ao ChatGPT. Uso, disponibilidade e limites dependem da conta e do provedor; o Método não estima custos nem garante pesquisa disponível. A pesquisa não é executada apenas por importar o arquivo.

## As oito etapas

1. **CRIAR — Definir recorte e plano de pesquisa.** Recebe nome/nicho/idioma e parâmetros do Método. Produz fronteiras, hipóteses de público, consultas e plano de amostragem.
2. **BUSCAR — Pesquisar demanda e oferta.** Recebe o plano. Pesquisa YouTube, páginas e comunidades públicas; registra evidências, URLs, datas, dados observados e limitações.
3. **CRIAR — Minerar mecanismos e hipóteses.** Recebe plano e pesquisa. Separa assunto, pergunta, promessa, ângulo e mecanismo; produz hipóteses originais e consultas para refutá-las.
4. **BUSCAR — Verificar oportunidades e contraprovas.** Recebe hipóteses e plano. Procura cobertura concorrente, sustentação factual e explicações alternativas. Preserva resultados desfavoráveis.
5. **CRIAR — Priorizar temas com histórico.** Recebe plano, hipóteses, ambas as pesquisas e até 50 temas registrados de outros Projetos do mesmo Canal. Produz relatório completo e candidatos individuais autocontidos, prontos para seleção.
6. **VALIDAR / Humano — Escolher um tema.** Mostra os candidatos da execução atual e entrega exatamente um texto escolhido. Rejeitar pausa para corrigir a pesquisa; não há repetição automática de todo o fluxo.
7. **CRIAR — Preparar tema e briefing.** Recebe o candidato escolhido e o plano. Entrega a saída oficial `theme`, texto único com pergunta, promessa, ângulo, fontes, limites e pontos a responder no roteiro.
8. **VALIDAR / Humano — Aprovar briefing.** Aprova o tema ou refaz apenas a etapa 7 com feedback, até o limite configurado de três tentativas. Preserva pesquisas e escolha.

O Método permanece linear. Não adiciona processos, plugins ou comportamentos ao núcleo. A seleção usa VALIDAR porque os candidatos nasceram nesta execução. ESCOLHER exigiria itens preexistentes na Biblioteca Estratégica.

## Como identifica oportunidades

O método busca uma pergunta específica do público, evidência de interesse, uma lacuna observável da oferta e uma abordagem viável e diferente do histórico. Views isoladas ou ausência de concorrentes não comprovam oportunidade. O alvo de amostra (3 canais e 10 vídeos) orienta a coleta; não obriga a inventar resultados quando o acesso é limitado.

A priorização atribui notas de 0 a 5 em cinco critérios:

- Aderência ao nicho: 25%.
- Evidência de demanda: 25%.
- Lacuna específica da oferta: 20%.
- Diferenciação frente ao histórico: 15%.
- Viabilidade de produção: 15%.

Total = soma de `peso × nota / 5`, de 0 a 100. Cada nota precisa de justificativa. É uma heurística editorial, não previsão de visualizações ou chance de viralizar. Confiança baixa/média/alta é apresentada separadamente. Uma ideia com nota alta e evidência fraca não se torna automaticamente validada.

Somente com ao menos cinco vídeos comparáveis do mesmo canal, formato e janela de idade, o método pode calcular views do vídeo / mediana da amostra, mostrando a conta e fontes. Sem esses dados, o indicador fica indisponível. Não estima CTR, retenção, receita ou volume de busca a partir de resultados públicos.

## Resultado e controles

O tema aprovado inclui: frase do tema, pergunta central, público, promessa honesta, ângulo original, mecanismo narrativo, justificativa, fontes, contraprovas, diferenças históricas, limitações e questões para o roteiro. Os Processos seguintes podem consumir o output oficial de Tema; o método não altera os seus Métodos de Título, Thumbnail ou Roteiro.

Candidatos descartados permanecem nas entregas do Projeto. O Método não cadastra automaticamente um banco de pautas na Biblioteca Estratégica. Para produzir outro vídeo, inicie outro Projeto; este fluxo escolhe um tema por Projeto.

O histórico é nativo: Processo Tema, output oficial `theme`, até 50 registros concluídos, excluindo o Projeto atual. Histórico vazio permite o primeiro vídeo. Ele não equivale a todo o histórico do YouTube, não inclui temas ainda sem entrega registrada e não garante deduplicação de Projetos pesquisados simultaneamente.

Se faltarem evidências, a etapa de candidatos gera uma pendência explícita que o humano deve rejeitar. Essa é uma instrução editorial, não uma barreira semântica determinística no núcleo: confira as fontes antes de aprovar. A mesma limitação vale para a qualidade das notas atribuídas pela IA.

## Verificação realizada

Validação local em 30/10/2026 sobre o checkout `8cf1cbe8bbdae6d7668a1b514f7e62917482bd9f`:

- Parser real `parseMethodFile` e contrato de importação `parseMethodImportFile`: aprovados.
- Validador real `validateBuilderMethods`, com manifesto local do plugin: sem erros ou avisos.
- Portas, shapes, ordem e referências entre Blocos: aprovados pelo validador.
- Contrato de histórico comparado ao gerador canônico: aprovado.
- Dezesseis resoluções de prompts (oito Blocos em dois Canais com nichos/idiomas diferentes): sem variáveis pendentes.
- Referência quebrada propositalmente: rejeitada.
- Serialização/importação preservadas e ausência de conexão/perfil/segredo no arquivo: verificadas.

Não foi executada pesquisa real no ChatGPT, nem importação pela interface com perfil autenticado. A validação comprova a estrutura importável e a compatibilidade declarada, não a qualidade de uma pesquisa futura, cotas ou comportamento do site.

O verificador reproduzível está em `validate.ts`: em um ambiente com as dependências locais funcionais, execute `npx tsx ecosystem/methods/pesquisar-minerar-temas/validate.ts`. `--write` normaliza e serializa novamente o arquivo usando as autoridades do projeto. Nesta sessão, o executável local do esbuild impediu iniciar tsx; a verificação foi concluída com um carregador TypeScript temporário, sem reinstalar ou alterar dependências do aplicativo.
