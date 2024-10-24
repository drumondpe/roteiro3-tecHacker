let ports = [];
let detectedCookies = new Set(); // Armazena cookies únicos detectados
let detectedScripts = new Set(); // Armazena scripts únicos detectados
let detectedThirdPartyHosts = new Set(); // Armazena domínios únicos de terceiros

// Conexão com a popup
browser.runtime.onConnect.addListener(function(port) {
    if (port.name === "port-from-popup") {
        ports.push(port);
        port.onDisconnect.addListener(function() {
            ports = ports.filter(p => p !== port);
        });
    }
});

// Função para registrar um domínio de terceiros
function logHost(host) {
    // Extraí apenas o domínio principal
    const mainDomain = new URL(host).hostname;
    
    if (!detectedThirdPartyHosts.has(mainDomain)) {
        detectedThirdPartyHosts.add(mainDomain);
        console.log("Conexão com domínio de terceira parte detectada:", mainDomain);
        ports.forEach(port => {
            port.postMessage({ type: "host", host: mainDomain, totalHosts: detectedThirdPartyHosts.size });
        });
    }
}

// Função para registrar cookies
function logCookies(details) {
    const currentUrl = details.url;
    const currentDomain = new URL(currentUrl).hostname;

    browser.cookies.getAll({ url: currentUrl }).then(cookies => {
        cookies.forEach(cookie => {
            const cookieKey = `${cookie.name}:${cookie.domain}`; // Cria uma chave única para o cookie

            if (!detectedCookies.has(cookieKey)) {
                detectedCookies.add(cookieKey);
                const firstPartyCount = Array.from(detectedCookies).filter(c => c.includes(currentDomain)).length;
                const thirdPartyCount = Array.from(detectedCookies).filter(c => !c.includes(currentDomain)).length;
                const sessionCount = Array.from(detectedCookies).filter(c => c.includes("session")).length;
                const persistentCount = Array.from(detectedCookies).filter(c => !c.includes("session")).length;

                ports.forEach(port => {
                    port.postMessage({
                        type: "cookies",
                        firstParty: firstPartyCount,
                        thirdParty: thirdPartyCount,
                        session: sessionCount,
                        persistent: persistentCount
                    });
                });
            }
        });
    });
}

// Listener para quando uma solicitação é completada
browser.webRequest.onCompleted.addListener(
    function(details) {
        logHost(details.url);
        logCookies(details); // Captura e classifica cookies quando a página é carregada
    },
    { urls: ["<all_urls>"] }
);

// Listener para antes de uma solicitação
browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        const url = new URL(details.url);
        const host = url.hostname;

        if (details.type === "script") {
            const scriptKey = details.url;
            if (!detectedScripts.has(scriptKey)) {
                detectedScripts.add(scriptKey);
                ports.forEach(port => {
                    port.postMessage({
                        type: "hijackWarning",
                        warning: `Script potencialmente perigoso detectado: ${details.url}`,
                        totalScripts: detectedScripts.size
                    });
                });
            }
        }

        logHost(host);
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// Listener para receber mensagens do content script
browser.runtime.onMessage.addListener(function(message) {
    if (message.type === "storageData") {
        ports.forEach(port => {
            port.postMessage({
                type: "storageData",
                localStorage: message.localStorage,
                sessionStorage: message.sessionStorage
            });
        });
    } else if (message.type === "canvasFingerprint") {
        ports.forEach(port => {
            port.postMessage({
                type: "canvasFingerprint",
                method: message.method,
                url: message.url
            });
        });
    }
});

// Função para reiniciar o histórico e contadores
function resetDetections() {
    detectedCookies.clear();
    detectedScripts.clear();
    detectedThirdPartyHosts.clear();
}
