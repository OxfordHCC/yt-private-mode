// Load private setting
chrome.storage.local.get(['private'], function (result) {
    // Check if loading successful, else use fallback
    let private = true;
    if (result.private) {
        private = result.private;
    }

    // Inject private into main.js
    let actualCode = `let private = ${private};`;
    let script = document.createElement('script');
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    // Inject main.js into YouTube page
    // This is required to send request to external servers
    script = document.createElement('script');
    script.src = chrome.extension.getURL('main.js');
    (document.head || document.documentElement).appendChild(script);
    script.remove();
});