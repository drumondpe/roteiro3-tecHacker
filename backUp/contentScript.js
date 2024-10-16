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
