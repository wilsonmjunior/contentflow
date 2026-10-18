# Google AI Studio Speech

Plugin ContentFlow API v2 que gera narração de áudio na página
[Generate Speech](https://aistudio.google.com/generate-speech?model=gemini-3.8-flash-tts)
do Google AI Studio, com o modelo Gemini TTS e perfil Chrome dedicado.

Não usa a API oficial com chave. Opera a interface autenticada do usuário pela
ContentFlow Browser Bridge, importa o WAV pela própria sessão e devolve um
artifact `audio`.

## Capability

- `generate-speech-in-browser` — transforma texto em narração WAV no processo
  `narration` (também disponível em `assets` e `editing`).

### Entradas e saídas

| Porta | Tipo | Função |
| --- | --- | --- |
| `text` | `text/one/inline` | Roteiro falado literalmente |
| `audio` | `audio/one/artifact` | Narração gerada |
| `metadata` | `record/many` | Modelo, voz, estilo e tamanho |

### Configuração do bloco

- `accountProfile` — alias do perfil global vinculado
- `fallbackAccountProfiles` — aliases extras, um por linha
- `model` — padrão `gemini-3.8-flash-tts`
- `voice` — uma das 30 vozes de estúdio (padrão `Kore`)
- `styleInstructions` — tom/ritmo; se vazio, usa a instrução do bloco

## Instalação

1. Abra **Plugins** no ContentFlow.
2. Escolha **Usar pasta ao vivo**.
3. Selecione esta pasta.
4. No perfil Chrome dedicado, carregue `ecosystem/browser-bridge` em
   `chrome://extensions` e conclua o login no Google AI Studio.
5. No Método, use **Salvar perfil** antes da primeira execução.
6. Revise as permissões `network`, `filesystem:read`, `filesystem:write` e
   `process`.

## Dados, efeitos e custo

- Provedor: Google AI Studio / Gemini TTS
- Dados enviados: texto do roteiro e instruções de estilo
- Efeito: criação de áudio na conta Google do perfil preparado
- Custo/cota: dependem da conta e do plano do AI Studio
- Logs: etapas, tamanhos e hashes curtos; nunca conteúdo, cookies ou tokens

## Validação

```bash
node --test ./test.mjs
npm run plugin:kit -- check /caminho/para/aistudio-speech-browser
```

`diagnosticFixture` cobre o caminho sem navegador. A geração real exige perfil
preparado, Browser Bridge e login no AI Studio.

## Limites da v1

- Modo **single-speaker** apenas
- Sem voice design / replication customizados pela UI
- Seletores dependem da interface atual do AI Studio; mudança de DOM pode exigir
  ajuste do handler

## Licença MIT

O código deste plugin é aberto sob MIT. A licença do aplicativo ContentFlow é
separada.
