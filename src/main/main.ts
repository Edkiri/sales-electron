import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { app, BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { fillTestDatabase } from "../database/dbFiller";
import { SaleMainListRow, getDailySales } from "./SaleParser";
import { addClientEvents } from "./ipcMainEvents/clientEvents";
import { addOrderEvents } from "./ipcMainEvents/orderEvents";
import { addPaymentEvents } from "./ipcMainEvents/paymentEvents";

let win: BrowserWindow;
let connection: Connection;
createConnection()
  .then((conn: Connection) => {

    connection = conn;
    fillTestDatabase(connection);
    addClientEvents(win, connection);
    addOrderEvents(win, connection);
    addPaymentEvents(win, connection);

  }).catch(error => console.error(error));

let DAILY_RATE: number; // It is assumed that is constant for the day, but user can change it.
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
  win.loadURL(path.join(__dirname, "../../src/main/index.html"));

  
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


ipcMain.on('getDailySales', async (event, date: Date) => {
  const salesToPrint: SaleMainListRow[] = await getDailySales(connection, date)
  event.sender.send('printSales', salesToPrint);
});

ipcMain.on("setDailyRate", (event, dailyRate) => {
  if (dailyRate) {
    DAILY_RATE = dailyRate;
    event.sender.send('rateValue', DAILY_RATE);
  }
})

ipcMain.on('createSale', (event) => {
  win.loadURL(path.join(__dirname, "../../src/renderer/sale/createSale.html"));
})

ipcMain.on("getDailyRate", e => {
  if (DAILY_RATE) e.sender.send('rateValue', DAILY_RATE);
})