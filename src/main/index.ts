import { BrowserWindow, app } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

import ipcSetup from './ipc-handler'

const isDev = process.env.NODE_ENV !== 'production'

let mainWindow: BrowserWindow | null

app.on('ready', () => {
    mainWindow = createMainWindow()
})

app.on('activate', () => {
    if (mainWindow == null) {
        mainWindow = createMainWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


function createMainWindow(): BrowserWindow {
    const win = new BrowserWindow({width: 1366, height: 960})
    ipcSetup()

    if (isDev) {
        win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
        win.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }))
    }

    win.on('closed', () => {
        mainWindow = null
    })

    return win
}
