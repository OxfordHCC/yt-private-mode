function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        private: document.querySelector("#private").checked,
    });
    document.querySelector("#saved").innerText = "saved";
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#private").checked =
            (result.private === undefined) ? true : result.private;
    }

    chrome.storage.sync.get(['private'], setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);