console.log("Loaded addon!");

var USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36,gzip(gfe)';

async function sha1(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

var funcHackyparse = function(strJson) {
    for (var intLength = 1; intLength < strJson.length; intLength += 1) {
        if (strJson[intLength - 1] !== '}') {
            continue;
        }

        try {
            return JSON.parse(strJson.substr(0, intLength));
        } catch (objError) {
            // ...
        }
    }

    return null;
}

function getCookieValue(a) {
   const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
   return b ? b.pop() : '';
}

async function _authorization_sapisidhash_header() {
    let now = Date.now();
    let sapisid = getCookieValue("SAPISID");
    if (!sapisid)
        sapisid = getCookieValue("__Secure-3PAPISID");
    if (!sapisid)
        return;
    let hex = await sha1(now + " " + sapisid + " https://www.youtube.com");
    return "SAPISIDHASH "+ now + "_" + hex;
}

function find_ytcfg(content) {
    return funcHackyparse(content.split('ytcfg.set(').find(function(strData) { return strData.indexOf('INNERTUBE_API_KEY') !== -1; }).slice(0, -2));
    //return funcHackyparse(content.split('"INNERTUBE_CONTEXT":')[1]);
}

function context_client_body(ytcfg) {
    return {
        'browserName': 'Firefox',
        'browserVersion': '87.0',
        'clientFormatFactor': 'UNKNOWN_FORM_FACTOR',
        'clientName': 'WEB',
        'clientVersion': ytcfg['INNERTUBE_CONTEXT_CLIENT_VERSION'],
        'connectionType': 'CONN_WIFI',
        'countryLocationInfo': {
            'countryCode': 'US',
            'countrySource': 'COUNTRY_SOURCE_IPGEO_INDEX'
        },
        'deviceMake': '',
        'deviceModel': '',
        'geo': 'US',
        'gl': ytcfg['INNERTUBE_CONTEXT_GL'],
        'hl': ytcfg['INNERTUBE_CONTEXT_HL'],
        'osName': 'X11',
        'osVersion': '',
        'platform': 'DESKTOP',
        'screenDensityFloat': randomchoice([1, 1.5, 2, 3]),
        'screenHeightPoints': randomrandrange(480, 7680),
        'screenPixelDensity': randomchoice([1, 2, 3]),
        'screenWidthPoints': randomrandrange(480, 7680),
        'timeZone': 'Europe/Berlin',
        'userAgent': USER_AGENT,
        'userInterfaceTheme': 'USER_INTERFACE_THEME_DARK',
        'utcOffsetMinutes': -300,
        'visitorData': ytcfg['VISITOR_DATA'],
    }
}

function randomrandrange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomchoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function single_feedback_api_call(ytcfg, feedback_token, click_tracking_params, api_url) {
    let url = "https://www.youtube.com" + api_url + "?key=" + ytcfg['INNERTUBE_API_KEY'];

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authority': 'www.youtube.com',
            'Authorization': await self._authorization_sapisidhash_header(),
            'X-Goog-AuthUser': '0',
            'X-Origin': 'https://www.youtube.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "context": {
                    "clickTracking": {
                        "clickTrackingParams": click_tracking_params
                    },
                    "client": context_client_body(ytcfg),
                    "request": {
                        "consistencyTokenJars": [],
                        "internalExperimentFlags": []
                    },
                    "user": {
                        "lockedSafetyMode": false
                    }
                },
                "feedbackTokens": [feedback_token],
                "isFeedbackTokenUnencrypted": false,
                "shouldMerge": false
            })
      });

    return response.json();
}


function toggleHistory() {
    fetch("https://www.youtube.com/feed/history").then(response => response.text()).then(async content => {
        console.log("Received content!");

        const contents_index = 3; // identifies the watch history (2 is search history)
        let ytcfg = find_ytcfg(content)

        let pattern = /var ytInitialData = (.+?);<\/script>/;
        let raw = pattern.exec(content)[1];
        let data = JSON.parse(raw);
        let info = data.contents.twoColumnBrowseResultsRenderer.secondaryContents.browseFeedActionsRenderer.contents[contents_index].buttonRenderer.navigationEndpoint.confirmDialogEndpoint.content.confirmDialogRenderer.confirmEndpoint;

        result = await single_feedback_api_call(
                ytcfg, info['feedbackEndpoint']['feedbackToken'],
                info['clickTrackingParams'],
                info['commandMetadata']['webCommandMetadata']['apiUrl']);

        console.log("Toggled history!");
    })
}




