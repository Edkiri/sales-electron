import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { app, BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { fillTestDatabase } from "../database/dbFiller";
import { SaleMainListRow, getDailySales } from "./SaleParser";
import { Client } from "../database/entities/Client";


let win: BrowserWindow;
let connection: Connection;
createConnection()
  .then((conn: Connection) => {
    connection = conn;
    fillTestDatabase(conn);
  }).catch(error => console.error(error));

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

ipcMain.on('verifyClient', async (event, clientIdCard: string) => {
  const client: Client = await connection
    .getRepository(Client)
    .createQueryBuilder("client")
    .where("client.identityCard = :clientIdCard", {clientIdCard: clientIdCard})
    .getOne()
  if(client) {
    event.sender.send('printClient', client);
  } else {
    const newClientWin = new BrowserWindow({
      parent: win,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
    })
    newClientWin.loadURL(path.join(__dirname, "../../src/createClient/createOrUpdateClientForm.html"));
    newClientWin.once('ready-to-show', () => {
      newClientWin.show();
      newClientWin.webContents.openDevTools();
      newClientWin.webContents.send('newClientIdCard', clientIdCard);
    });
  }
})

ipcMain.on('createClient', async (event, newClientData: any) => {
  try {
    const client = await createClient(newClientData);
    win.webContents.send("printClient", client);
    event.sender.send('closeWindow');
  } catch(err) {
    console.error(err)
  }
});


const createClient = async (newClientData: any): Promise<Client> => {
  const client = await connection.getRepository(Client).save({
    name: newClientData.name,
    identityCard: newClientData.idCard,
    phoneNumber: newClientData.phoneNumber
  })
  return client;
}

ipcMain.on("displayClientForm", (event, client) => {
  const updateClientWin = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
  })
  updateClientWin.loadURL(path.join(__dirname, "../../src/createClient/createOrUpdateClientForm.html"));
    updateClientWin.once('ready-to-show', () => {
      updateClientWin.show();
      updateClientWin.webContents.openDevTools();
      updateClientWin.webContents.send('printClientInfo', client);
    });
})

ipcMain.on("updateClient", async (event, clientData) => {
  try {
    const client = await connection.getRepository(Client).save({
      id: clientData.id,
      name: clientData.name,
      identityCard: clientData.identityCard,
      phoneNumber: clientData.phoneNumber
    })
    win.webContents.send("printClient", client);
    event.sender.send('closeWindow');
  } catch(err) {
    console.error("Error actualizando el cliente! -", err);
  }
})