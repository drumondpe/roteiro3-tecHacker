# roteiro3-tecHacker

- Domínios de terceira parte: Preto.
- Cookies: Azul.
- Armazenamento local: Laranja.
- Avisos de hijacking: Vermelho.

O plugin é capaz de:

- Detectar conexões a domínios de terceira parte: Isso é feito usando o webRequest para monitorar todas as requisições e logar domínios de terceiros.

- Detectar o armazenamento local (localStorage e sessionStorage): O contentScript.js captura o conteúdo de armazenamento local e envia para o background script, que o repassa para o popup.js, onde é exibido.

- Detectar potenciais ameaças de sequestro de navegador (hijacking e hook): O plugin monitora scripts potencialmente perigosos sendo injetados durante a navegação, além de alterações nas configurações críticas do navegador, como a página inicial e o motor de busca padrão. Quando essas mudanças são detectadas, uma notificação é enviada para o popup.js, alertando o usuário sobre possíveis tentativas de controle indevido do navegador, caracterizando ações de hijacking.

- Detectar cookies e supercookies: O plugin monitora os cookies injetados durante o carregamento de uma página, classificando-os como de primeira ou terceira parte, além de diferenciá-los entre cookies de sessão e cookies persistentes. Esses dados são enviados ao popup.js para exibição ao usuário.