# roteiro3-tecHacker

- Conexões a domínios de terceira parte: Preto.
- Potenciais ameaças de sequestro de navegador (hijacking e hook): Vermelho.
- Armazenamento de dados (LocalStorage e SessionStorage): Laranja.

O plugin é capaz de:

- Detectar conexões a domínios de terceira parte: Isso é feito usando o webRequest para monitorar todas as requisições e logar domínios de terceiros.

- Detectar o armazenamento local (localStorage e sessionStorage): O contentScript.js captura o conteúdo de armazenamento local e envia para o background script, que o repassa para o popup.js, onde é exibido.

- Detectar potenciais ameaças de sequestro de navegador (hijacking e hook): O plugin monitora scripts potencialmente perigosos sendo injetados durante a navegação, além de alterações nas configurações críticas do navegador, como a página inicial e o motor de busca padrão. Quando essas mudanças são detectadas, uma notificação é enviada para o popup.js, alertando o usuário sobre possíveis tentativas de controle indevido do navegador, caracterizando ações de hijacking.