// Função para sobrescrever métodos canvas e detectar fingerprinting
function detectCanvasFingerprint() {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    // Sobrescreve toDataURL
    HTMLCanvasElement.prototype.toDataURL = function(...args) {
        console.log("Canvas fingerprinting detectado via toDataURL");
        
        // Envia a detecção para o background script
        browser.runtime.sendMessage({
            type: "canvasFingerprint",
            method: "toDataURL",
            url: window.location.href
        });

        // Chama o método original
        return originalToDataURL.apply(this, args);
    };

    // Sobrescreve getImageData
    CanvasRenderingContext2D.prototype.getImageData = function(...args) {
        console.log("Canvas fingerprinting detectado via getImageData");
        
        // Envia a detecção para o background script
        browser.runtime.sendMessage({
            type: "canvasFingerprint",
            method: "getImageData",
            url: window.location.href
        });

        // Chama o método original
        return originalGetImageData.apply(this, args);
    };
}

// Chama a função de detecção ao carregar a página
detectCanvasFingerprint();

// Função para enviar os dados do localStorage e sessionStorage para o background script
function sendStorageData() {
    const localStorageData = {...localStorage}; // Captura todos os itens do localStorage
    const sessionStorageData = {...sessionStorage}; // Captura todos os itens do sessionStorage

    // Envia uma mensagem ao background script com os dados de armazenamento
    browser.runtime.sendMessage({
        type: "storageData",
        localStorage: localStorageData,
        sessionStorage: sessionStorageData
    });
}

// Envia os dados iniciais do storage ao carregar a página
sendStorageData();

// Escuta mudanças no localStorage diretamente (como `setItem`, `removeItem`)
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    sendStorageData(); // Chama a função para enviar dados atualizados
};

const originalRemoveItem = localStorage.removeItem;
localStorage.removeItem = function(key) {
    originalRemoveItem.apply(this, arguments);
    sendStorageData(); // Chama a função para enviar dados atualizados
};
