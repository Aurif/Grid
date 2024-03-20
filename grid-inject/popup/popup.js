function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

document.querySelector('div').onclick = function() {
    getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, "inject");
    });
}