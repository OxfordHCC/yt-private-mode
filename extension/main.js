let settings = undefined;
let vid = null; // keep track of current video ID

function main() {
    // Check if on a video page
    vid = (new URL(location)).searchParams.get('v');
    if (!vid) return;

    // if private mode is on, remove videos from watch history
    if (settings.private === undefined || settings.private)
        chrome.runtime.sendMessage({ message: 'send_vid', vid });
}

// load settings, then start extension
chrome.storage.sync.get(['private'], result => {
    settings = result;
    console.log('Settings loaded: ' + JSON.stringify(settings));

    document.addEventListener('yt-page-data-updated', main);
    document.addEventListener('yt-next-continuation-data-updated', main);

    main();
});