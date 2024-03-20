browser.runtime.onMessage.addListener(inject);

function inject(request, sender, sendResponse) {
    if (request !== "inject" || document.querySelector('iframe#injected-grid')) return

    const extensionURL = browser.runtime.getURL("");
    const iframe = document.createElement('iframe');
    iframe.src = `${extensionURL}index.html`
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.position = "fixed"
    iframe.style['z-index'] = "99999"
    iframe.style.top = "0"
    iframe.style.left = "0"

    document.querySelector('body').appendChild(iframe)
}
