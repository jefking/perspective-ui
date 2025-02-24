const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (message) => {
        console.log(message)
    }
})

// Expose console.log to renderer
contextBridge.exposeInMainWorld('console', {
    log: (...args) => console.log(...args),
    error: (...args) => console.error(...args)
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})