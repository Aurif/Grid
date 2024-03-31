async function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

async function closePinnedTabs(except) {
    browser.tabs.query({pinned: true}).then(tabs => {
        tabs.filter(t => t.id != except).forEach(t => browser.tabs.remove(t.id))
    })
}

document.querySelector('div').onclick = function () {
    getActiveTab().then(async (tabs) => {
        const tabId = tabs[0].id
        browser.tabs.sendMessage(tabId, "inject");
        closePinnedTabs(tabId)
        await browser.tabs.update(tabId, {pinned: true});
        window.close()
    });
}