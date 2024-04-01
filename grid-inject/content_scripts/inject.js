browser.runtime.onMessage.addListener(inject);

function inject(request, sender, sendResponse) {
    if (request !== "inject" || document.querySelector('iframe#injected-grid')) return

    const iframe = makeIframe()
    document.querySelector('body').appendChild(iframe)

    const eventListener = onMouseDown(iframe)
    window.addEventListener('mousedown', eventListener)
    setTimeout(() => {
        iframe.contentWindow.addEventListener('mousedown', eventListener)
        initialAnimation(iframe)
    }, 100)

    setStaticFavIcon()
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
    iframe.style.opacity = "0"
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

function initialAnimation(iframe) {
    iframe.style.opacity = "1"
    iframe.contentWindow.document.body.classList.remove("hidden")
}

function updateFavIcon(icon) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = icon
}

function setStaticFavIcon() {
    updateFavIcon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAMfAAADHwHmEQywAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAKNJREFUWIXt1rEJAkEQheF/vI2FCy8VrMAS7EWbEAw8U1MDO7AGS7AHQYQTBMWLZZ+R8RksTDITTfBgP4ZhGZOEZ41cXw8AkF5d+88SXOpmNQF43rcnk+alAO4TCEAAAhCAAAQggZaDKdH/WkM70LEUwLxPsvTuNrOhUCY/6mZ9Behv7VSVxsUAGTsPx6oDsAD4JNubiIMkAAEoVu4fkfsEAvAF1BsrXLz2JisAAAAASUVORK5CYII=")
}