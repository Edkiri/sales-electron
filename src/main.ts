import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { app, BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { fillTestDatabase } from "./dbFiller";
import { SaleMainListRow, getDailySales } from "./SaleParser";


let win: BrowserWindow;
let connection: Connection;
createConnection()
  .then((conn: Connection) => {
    connection = conn;
    fillTestDatabase(conn);
  }).catch(error => console.log(error));

const createMainWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });
  win.loadURL(path.join(__dirname, "../src/index.html"));

  
  win.once('ready-to-show', () => {
    win.show()
    win.webContents.openDevTools()
  });
};


app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createMainWindow()
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
});


ipcMain.on('getDailySales', async (event, date) => {
  const salesToPrint: SaleMainListRow[] = await getDailySales(connection, date)
  event.sender.send('printSales', salesToPrint);
});