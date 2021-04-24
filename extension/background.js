chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {
    switch (request.message) {
      case 'send_vid': {

        fetch('http://localhost:8080/?v=' + request.vid, {cache: 'no-store', timeout: 5000})
            .then(response => response.text())
            .then(console.log)
            .catch(console.log);

        break;
      }
      default:
    }
  }
);