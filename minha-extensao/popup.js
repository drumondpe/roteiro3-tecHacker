document.addEventListener('DOMContentLoaded', function() {
    const connectionsDiv = document.getElementById('connections');
    const clearButton = document.getElementById('clearButton');

    // Estabelece uma conexão com o background script
    const port = browser.runtime.connect({name: "port-from-popup"});

    // Escuta mensagens do background script
    port.onMessage.addListener(function(message) {
        connectionsDiv.textContent += `${message.host}\n`; // Adiciona cada host ao div
    });

    // Adiciona evento de clique ao botão para limpar o histórico
    clearButton.addEventListener('click', function() {
        connectionsDiv.textContent = ''; // Limpa o conteúdo do div
    });
});
