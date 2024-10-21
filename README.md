# roteiro3-tecHacker

- Domínios de terceira parte: Preto.
- Cookies: Azul.
- Armazenamento local: Laranja.
- Avisos de hijacking: Vermelho.
- Fingerprinting: Roxo.

O plugin é capaz de:

- Detectar conexões a domínios de terceira parte: Isso é feito usando o webRequest para monitorar todas as requisições e logar domínios de terceiros.

- Detectar o armazenamento local (localStorage e sessionStorage): O contentScript.js captura o conteúdo de armazenamento local e envia para o background script, que o repassa para o popup.js, onde é exibido.

- Detectar potenciais ameaças de sequestro de navegador (hijacking e hook): O plugin monitora scripts potencialmente perigosos sendo injetados durante a navegação, além de alterações nas configurações críticas do navegador, como a página inicial e o motor de busca padrão. Quando essas mudanças são detectadas, uma notificação é enviada para o popup.js, alertando o usuário sobre possíveis tentativas de controle indevido do navegador, caracterizando ações de hijacking.

- Detectar cookies e supercookies: O plugin monitora os cookies injetados durante o carregamento de uma página, classificando-os como de primeira ou terceira parte, além de diferenciá-los entre cookies de sessão e cookies persistentes. Esses dados são enviados ao popup.js para exibição ao usuário.

- Detectar Canvas Fingerprinting: O plugin monitora tentativas de fingerprinting de canvas. Ele identifica quando uma página tenta gerar impressões digitais únicas com base em renderizações de canvas, e alerta o usuário no popup.js, destacando a técnica de fingerprinting utilizada e a URL onde foi detectada.

Explicação da Pontuação de Privacidade:

- Pontuação: A pontuação começa em 10. Dependendo das detecções (cookies de terceira parte, scripts suspeitos, fingerprinting, e domínios de terceiros), a pontuação é reduzida.
- Pontuação para cookies: Se houver mais de 3 cookies de terceira parte, a pontuação é reduzida em 2 pontos.
- Pontuação para scripts (hijacking): Se houver detecção de scripts potencialmente perigosos, 2 pontos são subtraídos.
- Pontuação para fingerprinting: Se qualquer técnica de fingerprinting for detectada, subtraímos 2 pontos.
- Pontuação para domínios de terceira parte: Se houver mais de 5 domínios de terceira parte, 2 pontos são subtraídos. Se houver entre 3 e 5, subtraímos 1 ponto.
