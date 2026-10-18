# Instalar a ContentFlow Browser Bridge

No fluxo normal do ContentFlow, **você não precisa instalar esta extensão manualmente**. Ao preparar uma conta ou executar um plugin de navegador, o núcleo abre o Chrome dedicado e instala automaticamente esta pasta estável.

## Quando usar instalação manual

Use os passos abaixo somente se o aplicativo pedir reparo, se a ponte sumiu do perfil, ou se você estiver validando a extensão fora do ContentFlow:

1. No Chrome dedicado do perfil, acesse `chrome://extensions`.
2. Ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione esta pasta `browser-bridge` inteira, não um arquivo individual.
5. Volte ao provedor usado pelo plugin e conclua o login.

Não mova a pasta estável depois de carregá-la. Depois de uma atualização da ponte, o ContentFlow reinsere a extensão na próxima sessão; em reparo manual, use **Recarregar** no card da extensão.

Para desconectar, faça logout no provedor e remova a extensão deste perfil se desejar. Os arquivos já entregues ao ContentFlow não são apagados.

Esta é a única extensão companheira para todos os plugins de automação de navegador compatíveis. Cada novo provedor é acrescentado por versão desta ponte; não existe uma extensão separada por plugin.
