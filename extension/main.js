let settings = undefined;
let items = undefined;
let vid = null; // keep track of current video ID

function main() {
    // Check if on a video page
    vid = (new URL(location)).searchParams.get('v');
    if (!vid) return;

    // Find video recommendations
    if (!items) {
        items = document.querySelector("#related #items");
        
        if (!items)
            return;
        
        items.insertAdjacentHTML('beforebegin', '<div id="upnext" class="style-scope ytd-compact-autoplay-renderer" style="padding-bottom:12px;">Filtered Recommandations</div> <button id="updatebutton">Update </button>');
        document.querySelector('#updatebutton').addEventListener("click", main);
    }

    if (settings.hide === undefined || settings.hide) {
        for (s of items.childNodes) {
            if (s.getElementsByClassName("ytd-thumbnail-overlay-resume-playback-renderer").length > 0) {
                s.style.display = "none";
            }
        }
    }

    if (settings.sort) {
        toSort = Array.prototype.slice.call(items.childNodes, 0);
        toSort.sort((a, b) => {
            return a.querySelector("#text.ytd-channel-name").innerText > b.querySelector("#text.ytd-channel-name").innerText;
        });
        items.innerHTML = "";
        for (var i = 0, l = toSort.length; i < l; i++) {
            items.appendChild(toSort[i]);
        }
    }

    if (settings.long === undefined || settings.long) {
        debugger;
        for (s of items.childNodes) {
            let durationField = s.querySelector('span.ytd-thumbnail-overlay-time-status-renderer');
            if (!durationField)
                continue;

            let duration = durationField.textContent.trim().split(':');

            if (duration.length == 3 // more than one hour
                || (duration.length == 2 && parseInt(duration[0]) >= 4)) {
                s.style.display = "none";
            }
        }
    }
}

// load settings, then start extension
chrome.storage.sync.get(['hide', 'sort', 'long'], result => {
    settings = result;
    console.log('Settings loaded: ' + JSON.stringify(settings));

    document.addEventListener('yt-page-data-updated', main);
    document.addEventListener('yt-next-continuation-data-updated', main);
    main();

    // create an observer to detect HTML change in recommanded videos
    // does not work yet : clashes with videos ordering
    var observer = new MutationObserver(function(mutations) {
        console.log("changed !");
        //main();
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(items, config);
});