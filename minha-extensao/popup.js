document.addEventListener('DOMContentLoaded', function() {
    const connectionsDiv = document.getElementById('connections');
    const clearButton = document.getElementById('clearButton');

    // Estabelece uma conexão com o background script
    const port = browser.runtime.connect({name: "port-from-popup"});
    console.log("Conexão estabelecida com o background script...");

    // Escuta mensagens do background script
    port.onMessage.addListener(function(message) {
        console.log("Mensagem recebida no popup:", message);
        
        // Trata as mensagens do tipo "host" (domínios de terceira parte)
        if (message.type === "host") {
            connectionsDiv.textContent += `Dominio de terceira parte: ${message.host}\n`; // Adiciona cada host ao div
        }

        // Exibe os dados de armazenamento local e de sessão
        if (message.type === "storageData") {
            connectionsDiv.textContent += `\nLocalStorage:\n${JSON.stringify(message.localStorage, null, 2)}\n`;
            connectionsDiv.textContent += `\nSessionStorage:\n${JSON.stringify(message.sessionStorage, null, 2)}\n`;
        }

        // Exibe avisos de hijacking ou hooking
        if (message.type === "hijackWarning") {
            connectionsDiv.textContent += `%c${message.warning}\n`; // Adiciona um aviso ao div
        }
    });

    // Adiciona evento de clique ao botão para limpar o histórico
    clearButton.addEventListener('click', function() {
        connectionsDiv.textContent = ''; // Limpa o conteúdo do div
    });
});
