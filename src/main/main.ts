import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { app, BrowserWindow, ipcMain, } from 'electron';
import * as path from "path";
import { fillTestDatabase } from "../database/dbFiller";
import { SaleMainListRow, getDailySales } from "./SaleParser";
import { runClientMainEvents } from "./clientMainEvents";
import { Product } from "../database/entities/Product";


let win: BrowserWindow;
let connection: Connection;
createConnection()
  .then((conn: Connection) => {

    connection = conn;
    fillTestDatabase(connection);
    runClientMainEvents(win, connection);

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

ipcMain.on("displayProductsWindow", (event) => {
  const newOrderWin = new BrowserWindow({
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
  newOrderWin.loadURL(path.join(__dirname, "../../src/renderer/order/createOrder.html"));
  newOrderWin.once('ready-to-show', () => {
    newOrderWin.show();
    newOrderWin.webContents.openDevTools();
  });
})

ipcMain.on("searchProductByName", async (event, productName: string) => {
  const words: string[] = productName.split(" ");
  let queryBuilder = connection.getRepository(Product).createQueryBuilder("product");
  let products: Product[] = [];
  let counter = 0;
  for( const word in words ) {
    if(counter === 0) {
      products = await queryBuilder
        .where("LOWER(product.name) LIKE '%' || LOWER(:productName) || '%'", {productName: words[word]})
        .limit(100)
        .getMany();
      counter++;
    } else {
      if(["", " "].indexOf(words[word]) <= -1) {
        products = products.filter(product => product.name.toLowerCase().includes(words[word].toLowerCase()));
      }
    }
  }
  event.sender.send("printProducts", products);
})


ipcMain.on("sendOrderData", (event, orderData) => {
  orderData['total'] = <number>orderData.productPrice * <number>orderData.amount;
  win.webContents.send('printPreOrderToTree', orderData);
  event.sender.send('closeWindow');
})