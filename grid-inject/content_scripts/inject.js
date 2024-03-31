browser.runtime.onMessage.addListener(inject);

function inject(request, sender, sendResponse) {
    if (request !== "inject" || document.querySelector('iframe#injected-grid')) return

    const iframe = makeIframe()
    document.querySelector('body').appendChild(iframe)

    const eventListener = onMouseDown(iframe)
    window.addEventListener('mousedown', eventListener)
    setTimeout(() => {
        iframe.contentWindow.addEventListener('mousedown', eventListener)
    }, 100)

}

function makeIframe() {
    const extensionURL = browser.runtime.getURL("");
    const iframe = document.createElement('iframe');
    iframe.src = `${extensionURL}index.html`
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.position = "fixed"
    iframe.style['z-index'] = "99999"
    iframe.style.top = "0"
    iframe.style.left = "0"
    iframe.id = "injected-grid"
    return iframe
}

function onMouseDown(iframe) {
    let throttled = throttle(toggleVisible, 1050)
    return e => {
        if (e.button !== 1) return
        e.preventDefault()
        throttled(iframe)
    }
}

function toggleVisible(iframe) {
    if (iframe.style.display === "none") {
        iframe.style.display = null
        setTimeout(() => {
            iframe.contentWindow.document.body.classList.remove("hidden")
        }, 10)
    } else {
        iframe.contentWindow.document.body.classList.add("hidden")
        setTimeout(() => {
            iframe.style.display = "none"
        }, 1050)
    }
}

function throttle(mainFunction, delay) {
    let nextRun = 0

    return (...args) => {
        if (nextRun < Date.now()) {
            mainFunction(...args);
            nextRun = Date.now() + delay;
        }
    };
}