// Insert script
script = document.createElement('script');
script.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(script);
script.remove();

// React to browser button clicks
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request && request.action == "run") {
        let script = document.createElement('script');
        script.textContent = "setTimeout(toggleHistory, 1000);";
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
});
