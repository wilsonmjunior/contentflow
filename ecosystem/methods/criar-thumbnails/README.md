# Criar thumbnails — Tema, título e nicho do canal

Método do Processo **Thumbnail**, contrato v3, versão editorial inicial 1.0.0. Criado para o checkout ContentFlow 1.3.7. Recebe os resultados oficiais de Tema e Título, prepara conceitos visuais, gera as imagens aprovadas e entrega exatamente uma thumbnail escolhida pelo criador.

## Importar e usar

1. Em **Métodos → Importar Método**, selecione `criar-thumbnails.contentflow-method.json` e aplique ao Processo Thumbnail do Canal desejado. Revise a substituição se já houver um Método configurado.
2. Mantenha **Tema → Título → Thumbnail** nessa ordem relativa. O Projeto precisa ter Tema e Título concluídos. Os métodos criados anteriormente são compatíveis; outros métodos também funcionam se entregarem os outputs oficiais desses Processos.
3. Instale e ative **ChatGPT Browser Studio**, versão local declarada/verificada **2.0.2**, com geração de texto, pesquisa web, geração de imagem e análise de imagens. Vincule e prepare explicitamente um perfil autenticado e selecione-o nos Blocos de IA.
4. Confira nome, nicho e idioma do Canal. No primeiro Bloco, personalize identidade visual, restrições, quantidade de conceitos, orientação de texto e formato solicitado.
5. Execute o Método. Aprove quais conceitos merecem geração e, depois da revisão visual, escolha exatamente uma imagem pronta. Essa escolha é a aprovação editorial final.

Padrões iniciais: até **3 conceitos**, composição horizontal **16:9**, preferência por imagem sem texto; quando necessário, de 1 a 4 palavras complementares ao título. Esses padrões são editáveis. O pedido de proporção no prompt não é uma garantia das dimensões do arquivo gerado.

## Etapas e entregas

1. **CRIAR — Definir promessa visual e identidade.** Recebe Tema e Título. Produz briefing autocontido com título exato, promessa, público, foco, hierarquia, estilo, texto, restrições e consultas de referência.
2. **BUSCAR — Pesquisar referências do nicho.** Recebe o briefing. Produz relatório com URLs, padrões observáveis, fórmulas repetidas, oportunidades e limitações. Só analisa composição de referências quando a imagem foi efetivamente acessível.
3. **CRIAR — Criar conceitos e prompts.** Recebe Tema, Título, briefing e pesquisa. Produz relatório comparativo e uma lista de prompts completos, cada um para uma thumbnail, com abordagens visuais distintas.
4. **VALIDAR / Humano — Escolher conceitos para gerar.** Aprova um ou mais prompts. Rejeitar refaz os conceitos com feedback, até três tentativas, preservando pesquisa e briefing. Essa etapa permite controlar quais conceitos consumirão geração.
5. **CRIAR — Gerar thumbnails.** Recebe os prompts aprovados e diretrizes comuns. A lista é conectada à porta de lote do plugin; o núcleo administra uma unidade de trabalho por prompt. Produz as imagens reais, sem pedir mosaicos ou grades de opções.
6. **CRIAR — Revisar legibilidade e promessa.** Recebe todas as imagens geradas e o briefing. O plugin de análise visual produz uma comparação de fidelidade, foco, contraste, grafia, hierarquia, áreas seguras e defeitos, sem modificar as imagens.
7. **VALIDAR / Humano — Escolher e aprovar imagem final.** Apresenta a galeria gerada. A escolha de uma imagem torna-se a saída oficial `thumbnail`, com shape `image/one/artifact`, sem uma nova geração após a escolha.

O Método preserva briefing, pesquisa, conceitos, prompts, imagens e análise como entregas intermediárias. Não altera o núcleo, os Métodos anteriores ou a Biblioteca Estratégica. A seleção usa VALIDAR porque trabalha com resultados criados nesta execução.

## Resultado oficial e preservação da escolha

A geração expõe as portas obrigatórias do plugin: a primeira imagem individual e a coleção de imagens geradas. A primeira imagem é uma entrega intermediária; a seleção nativa posterior é a autoridade do resultado final.

O núcleo deriva `thumbnail` do `selected_value` da última etapa. O verificador deste Método exercita a escolha da segunda imagem e confirma que ela substitui a primeira na derivação do output oficial, sem editar ou regenerar seu conteúdo. Não há Bloco posterior que possa substituir silenciosamente a escolha.

Se nenhuma imagem estiver adequada, rejeite e pause para ajustar conceitos ou refazer a geração explicitamente. A rejeição final não dispara outra geração de imagens. A análise da IA é consultiva; a decisão depende da inspeção humana da imagem e do relatório.

## Identidade e referências

O Método usa nome, nicho e idioma por variáveis nativas e recebe Tema e Título por ligações explícitas. Público e identidade visual vêm do briefing ou dos parâmetros; não são lidos de campos inexistentes do Canal.

Não há logo, rosto do apresentador ou imagem de marca anexados automaticamente. A configuração padrão gera conceitos originais a partir de texto. Usar referências visuais próprias exige configurar uma entrada compatível e vinculada explicitamente no Bloco, respeitando a porta `image/many/artifact` do plugin. O pacote não carrega referências de outros canais ou de outros Projetos.

A pesquisa de referências entrega texto e links. Ela não baixa imagens externas nem as anexa ao gerador. Quando a imagem da referência não estiver acessível, o relatório deve declarar a ausência de análise visual. Não deve deduzir composição a partir do título do vídeo.

## Qualidade e limites

Os conceitos devem complementar o título com uma promessa visual clara, um foco dominante e uma relação reconhecível em tamanho pequeno. Evitam copiar identidade de concorrentes, excesso de texto, marcas não fornecidas e alegações visuais sem suporte. Metáforas e reconstituições precisam ser reconhecidas como escolhas visuais, sem serem apresentadas como prova documental.

Antes de aprovar, confira grafia, detalhes de rostos/objetos, foco, contraste, áreas seguras, proporção e adequação do arquivo. O Método solicita 16:9, mas **não recorta, redimensiona, comprime ou converte arquivos**. Medidas exatas, peso e limites de envio precisam ser conferidos em ferramenta apropriada quando necessários. O relatório visual não equivale a uma medição técnica ou teste real em dispositivos.

Prompts, análise de legibilidade e verificação de promessas são orientações à IA, não barreiras semânticas determinísticas no núcleo. Cotas, disponibilidade, quantidade de variantes e qualidade dependem do provedor. Uma unidade pode devolver mais de uma variante; o Método não garante uma contagem exata de imagens geradas.

Se a pesquisa web estiver indisponível, o Método pode continuar com conceitos originais baseados no Tema/Título, explicitando essa limitação. Pendências de Tema/Título devem ser rejeitadas na aprovação dos conceitos. A análise visual não deve ser declarada concluída sem acesso aos anexos.

O Método não garante CTR, visualizações ou viralização, não inicia teste A/B e não publica nem altera vídeos existentes. Antes de publicar, confirme que a imagem corresponde também ao conteúdo efetivamente produzido.

## Dependências e dados

Cinco Blocos usam IA: briefing, pesquisa, conceitos, geração e análise visual. As entradas vinculadas são enviadas ao ChatGPT conforme o Bloco; a geração pode envolver várias unidades. O custo e os limites dependem da conta e do provedor. A aprovação prévia dos conceitos controla quais prompts entram nessa geração.

O arquivo é portátil: não contém contas, caminhos físicos, perfis, conexões ou credenciais. Importar não instala plugins nem vincula perfis silenciosamente. A criação do arquivo também não executou nenhuma geração.

## Verificação local

O verificador `validate.ts` usa as autoridades reais do checkout:

- Parser/importador de Métodos e Builder: aprovados, sem erros ou avisos.
- Portas de texto/imagem, cardinalidade e ligação à geração em lote: aprovadas.
- Integração dos três Métodos, Tema, Título e Thumbnail: aprovada.
- Catorze resoluções de instruções em dois Canais com nichos/idiomas diferentes: sem variáveis pendentes.
- Escolha da segunda imagem promovida a output oficial pelo `deriveProcessOutput`: aprovada em cenário sintético.
- Ligação incorreta de texto na análise de imagens e Thumbnail antes de Título: rejeitadas.
- Requisitos de processos anteriores, serialização e ausência de perfis/credenciais: verificados.

Não foi realizada importação pela interface nem geração/análise no ChatGPT autenticado. A verificação comprova o contrato e a derivação do resultado escolhido, não uma execução real do provedor ou a qualidade das imagens.

Para repetir com dependências locais funcionais: `npx tsx ecosystem/methods/criar-thumbnails/validate.ts`. `--write` normaliza e serializa o arquivo pelas autoridades do projeto. Nesta sessão foi usado o carregador TypeScript temporário das verificações anteriores devido ao problema preexistente do esbuild, sem alterar dependências do aplicativo.
