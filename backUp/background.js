let ports = [];
browser.runtime.onConnect.addListener(function(port) {
    if (port.name === "port-from-popup") {
        ports.push(port);
        port.onDisconnect.addListener(function() {
            ports = ports.filter(p => p !== port);
        });
    }
});

function logHost(host) {
    console.log("Conexão com domínio de terceira parte detectada:", host);
    ports.forEach(port => {
        port.postMessage({type: "host", host: host}); // Certifique-se de que o tipo é "host"
    });
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        const url = new URL(details.url);
        const host = url.hostname;
        logHost(host);

        // Detecta se scripts estão sendo injetados
        if (details.type === "script") {
            console.log('%cScript detectado: ' + url.href, 'color: red; font-weight: bold;');
            ports.forEach(port => {
                port.postMessage({type: "hijackWarning", warning: `Script potencialmente perigoso detectado: ${url.href}`});
            });
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

// Recebe dados do content script sobre o armazenamento local
browser.runtime.onMessage.addListener(function(message) {
    if (message.type === "storageData") {
        console.log("Recebendo dados do content script...");
        console.log("Dados do localStorage:", message.localStorage);
        console.log("Dados do sessionStorage:", message.sessionStorage);

        // Enviar os dados para a popup
        ports.forEach(port => {
            port.postMessage({
                type: "storageData",
                localStorage: message.localStorage,
                sessionStorage: message.sessionStorage
            });
        });
    } else {
        console.log("Mensagem desconhecida recebida:", message);
    }
});

// Verifica alterações na página inicial
browser.settings.onChange.addListener((changes) => {
    if (changes.name === "homepageOverride") {
        console.log('%cA página inicial foi modificada!', 'color: red; font-weight: bold;', changes.value);
        ports.forEach(port => {
            port.postMessage({type: "hijackWarning", warning: "A página inicial foi modificada!"});
        });
    }
});

// Verifica alterações no motor de busca padrão
browser.search.onDefaultSearchEngineChanged.addListener((engine) => {
    console.log('%cO motor de busca padrão foi alterado!', 'color: red; font-weight: bold;', engine.name);
    ports.forEach(port => {
        port.postMessage({type: "hijackWarning", warning: "O motor de busca padrão foi alterado!"});
    });
});
