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
        port.postMessage({host: host});
    });
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        const url = new URL(details.url);
        const host = url.hostname;
        logHost(host);
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);