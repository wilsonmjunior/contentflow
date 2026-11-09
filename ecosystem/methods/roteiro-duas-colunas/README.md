# Roteiro em duas colunas e sincronização pela narração final

Métodos v3 para ContentFlow 1.3.7, versão editorial inicial 1.0.0. O roteiro usa exatamente duas colunas: **ÁUDIO** e **VÍDEO**. As durações editoriais são estimativas; os intervalos de fala e gatilhos de edição são ajustados posteriormente usando timestamps reconhecidos no áudio final.

## Arquivos para importar

- `roteiro-duas-colunas.contentflow-method.json`: Método do Processo **Roteiro**.
- `narracao-timestamps-reais.contentflow-method.json`: complemento do Processo **Narração**, recebendo áudio já produzido, transcrevendo e ajustando as cenas.
- `roteiro-e-sincronizacao.contentflow-method-pack.json`: pacote com os dois Métodos acima para revisar/aplicar juntos.

Em **Métodos → Importar Método**, selecione o pacote ou um arquivo individual. Revise os Processos que serão substituídos. O complemento não é acrescentado automaticamente a um Método de Narração existente: importar para esse Processo pode substituir sua estratégia atual. Se já tiver geração de voz configurada, preserve-a e incorpore os Blocos de transcrição/alinhamento pelo editor, conectando o áudio final explicitamente.

Nenhum Método de Canal existente foi substituído nesta criação. O pacote contém somente Roteiro e Narração; os três Métodos anteriores não precisam ser reimportados.

## Ordem e dependências

Mantenha **Tema → Título → Roteiro → Narração → Assets/Edição** na ordem relativa. Thumbnail pode continuar antes de Roteiro como no fluxo anterior. Roteiro recebe as saídas oficiais de Tema e Título, independentemente dos nomes de seus Blocos.

O Método de Roteiro não depende de áudio futuro. O ajuste posterior é uma nova entrega no Processo Narração; não reescreve retroativamente o roteiro oficial nem cria dependência circular. A referência ao texto limpo de narração é transportada no pacote e remapeada pelo importador ao copiar os Blocos.

Plugins necessários:

- **ChatGPT Browser Studio 2.0.2**, para texto, pesquisa e análise de documentos SRT; exige perfil local autenticado e explicitamente vinculado/preparado.
- **AssemblyAI SRT Studio 2.0.1**, somente no complemento de Narração; exige conexão local e `ASSEMBLYAI_API_KEYS` no cofre/configuração segura do plugin. O pacote declara esse requisito, sem carregar chave ou conexão.

O áudio será enviado à AssemblyAI; o SRT e o roteiro serão enviados ao ChatGPT na etapa de alinhamento. Custos, limites e disponibilidade dependem das contas. A criação/importação do Método não executa esses envios. Há conferência humana do áudio antes da transcrição.

## Método Roteiro: sete etapas

1. **CRIAR — Planejar história e pesquisa.** Recebe Tema/Título e define público, promessa, arco narrativo, orçamento de palavras, CTA, perguntas e consultas de pesquisa.
2. **BUSCAR — Pesquisar fatos e exemplos.** Produz dossiê por seção com fontes diretas, fatos utilizáveis, contradições e lacunas. Pesquisa indisponível fica explícita.
3. **CRIAR — Escrever duas colunas.** Produz rascunho com cena por linha, narrativa à esquerda e instrução visual correspondente à direita.
4. **CRIAR — Revisar.** Confere fatos, promessa, continuidade, ritmo e separação entre fala/instrução. Entrega a tabela oficial `script`, com tempos marcados como estimativas.
5. **VALIDAR / Humano — Aprovar roteiro.** Reprovar refaz a revisão com feedback, preservando plano, pesquisa e rascunho.
6. **CRIAR — Separar texto literal para narrar.** Extrai somente os campos FALA, sem reescrever, incluindo apenas palavras pronunciadas. Entrega `narration_text`, separado da tabela.
7. **VALIDAR / Humano — Conferir texto.** Compara a extração com os campos FALA e exclui comandos, rótulos, efeitos, tempos, fontes e texto visual da locução. Reprovar refaz somente a extração.

No primeiro Bloco são editáveis duração desejada, palavras por minuto usadas como estimativa, público/estilo/restrições e CTA. Padrões iniciais: 3 minutos e 140 palavras/minuto. Eles não medem duração nem determinam timestamps.

## Como a tabela é escrita

A tabela possui somente duas colunas, mesmo quando incluir cena, tempo e fonte. Esses elementos ficam dentro das células correspondentes.

- **ÁUDIO:** rótulo editorial C001, seção narrativa, tempo explicitamente ESTIMADO, campo **FALA** com palavras pronunciadas, **DIREÇÃO** com tom/pausas e **SFX** com efeito e gatilho. SFX não é fala.
- **VÍDEO:** imagem/B-roll, sujeito e ação, enquadramento, texto exato na tela, gráfico com dados sustentados, movimento/zoom, transição, gatilho verbal e fontes de produção quando aplicáveis.

Hook, conexão, desenvolvimento e conclusão/CTA são adaptados ao nicho. As falas exemplificativas de finanças fornecidas na solicitação não são usadas como roteiro fixo para outros canais. Afirmações numéricas e estudos exigem sustentação.

Mudanças visuais em torno de 3 a 5 segundos são uma diretriz flexível. Não se afirma que todo plano acima de cinco segundos perde retenção. Os cortes devem servir à compreensão e acompanhar o conteúdo, sem quebrar o sentido da fala.

Os rótulos C001/C002 são referências editoriais dentro do documento, não identidades operacionais do Core. A tabela é conteúdo textual Markdown; o Método não cria um novo editor ou tipo de dado no aplicativo.

## Complemento Narração: cinco etapas

1. **CRIAR / Humano — Enviar narração final.** Recebe o roteiro e o texto limpo. Você grava/gera a voz na ferramenta desejada e envia um único MP3 ou WAV, na ordem completa e com pausas definitivas. Este Bloco não escolhe voz/fornecedor nem sintetiza automaticamente.
2. **VALIDAR / Humano — Conferir áudio.** Ouça e compare com o texto. Reprovar pausa antes do envio à transcrição. Aprovar confirma a versão a usar e libera o envio ao serviço configurado.
3. **CRIAR / Código — Capturar timestamps.** A AssemblyAI transcreve o arquivo final. A configuração `max_words` com `maxWordsPerCue: 1` produz um cue SRT por palavra, usando os inícios/fins retornados pelo reconhecimento.
4. **CRIAR / IA — Ajustar cenas.** O ChatGPT recebe o arquivo SRT por palavra e o roteiro original. Produz nova tabela `timed_script`, de duas colunas, com fala, intervalos, referências dos cues e gatilhos visuais ajustados.
5. **VALIDAR / Humano — Conferir sincronia.** Compare tabela, SRT e áudio. Reprovar pausa para corrigir a origem adequada; não gera voz nem envia uma nova transcrição automaticamente.

## Regras do ajuste temporal

O início da fala de uma cena deve vir do início da primeira palavra localizada no SRT; seu fim, do fim da última palavra localizada. A tabela cita os números dos cues usados, permitindo rastrear cada intervalo.

Não se distribui uniformemente a duração entre cenas. Não se usa a estimativa do roteiro como tempo medido. Uma cena pode abranger vários cues, e um cue de legenda não vira automaticamente uma cena de vídeo. Subdivisões visuais usam trechos/cues reais e subrótulos editoriais, sem alterar a ordem da fala.

Para “olhe este gráfico”, por exemplo, a apresentação do gráfico usa a palavra-gatilho reconhecida no áudio. SFX entra como evento planejado associado à palavra/ação, sem afirmar que já existe no arquivo de voz. Música, SFX e montagem não são produzidos ou misturados por este pacote.

Pausas entre cues são preservadas como intervalos sem fala; a continuidade visual pode cobri-las. O último timestamp reconhecido não comprova a duração total do arquivo, nem mede necessariamente um silêncio de cauda. O Método não deve inventar essas informações.

Se houver nome próprio incorreto, fala omitida/extra, repetição ambígua, cena sem correspondência ou SRT ilegível, o trecho fica **PENDENTE DE CONFERÊNCIA**, sem timestamp fabricado. O reconhecimento automático pode errar. Tempos obtidos do áudio são evidências para alinhamento, não garantia de sincronia perfeita; a associação semântica proposta pela IA exige conferência por escuta.

Alterar voz, velocidade, pausas, cortes ou palavras depois da transcrição invalida os tempos dessa versão. Envie a nova versão e refaça transcrição/alinhamento. Corrigir somente uma associação de cena não exige gerar o áudio novamente.

## Entregas e uso posterior

- **Roteiro / output oficial `script`:** tabela aprovada com tempos estimados, preservada como origem editorial.
- **Roteiro / Separar texto literal / `narration_text`:** texto limpo para gravação/TTS.
- **Narração / output oficial `audio`:** o mesmo áudio final enviado e aprovado.
- **Narração / Capturar timestamps / `word_srt`:** arquivo SRT por palavra (`text/many/artifact`, um arquivo neste fluxo).
- **Narração / Ajustar cenas / `timed_script`:** tabela ajustada ao áudio, pronta para ser ligada explicitamente aos Métodos de Assets/Edição após aprovação.

Para produção posterior, selecione no editor a entrega **Narração → Ajustar as cenas aos timestamps da narração → Roteiro em duas colunas ajustado ao áudio**. Não use o output oficial de Narração como se fosse a tabela: ele continua sendo áudio. O pacote não altera automaticamente os Métodos de Assets ou Edição.

## Validação e limites do que foi testado

`validate.ts` verificou:

- Parsers reais dos dois Métodos e do pacote; serialização/importação: aprovados.
- Builder com manifestos locais e conexão de teste apenas em memória: sem erros/avisos. Ausência de associação da AssemblyAI bloqueia corretamente a configuração.
- Integração dos cinco Métodos criados nesta conversa: aprovada.
- Vinte e quatro resoluções de instruções em dois Canais: sem variáveis pendentes.
- Remapeamento da referência entre extração de fala e complemento de Narração na cópia/importação: aprovado.
- Preservação de timestamps e pausas pelo compilador SRT real do plugin, usando palavras sintéticas como retorno do provedor: aprovada.
- Ordem inválida de Processos e dependência circular em áudio futuro: rejeitadas.
- Áudio oficial preservado mesmo com entrega textual de tabela ajustada: aprovado.
- Ausência de conta, perfil, conexão ou credenciais no pacote: verificada.

Não foi enviada narração real à AssemblyAI nem executado alinhamento no ChatGPT, e não houve importação pela interface. Os testes demonstram compatibilidade estrutural e preservação dos tempos fornecidos no cenário sintético, não acurácia de transcrição real ou correspondência palavra/cena no provedor.

Para repetir com dependências funcionais: `npx tsx ecosystem/methods/roteiro-duas-colunas/validate.ts`. `--write` normaliza e serializa os dois Métodos e o pacote. Nesta sessão foi usado o carregador TypeScript temporário das verificações anteriores, sem reinstalar ou alterar dependências do aplicativo.
