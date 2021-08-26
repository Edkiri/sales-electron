import "reflect-metadata";
import { Connection } from "typeorm";
import { Client } from "./entities/Client";
import { Currency } from "./entities/Currency";
import { Order } from "./entities/Order";
import { Payment } from "./entities/Payment";
import { PaymentMethod } from "./entities/PaymentMethod";
import { Product } from "./entities/Product";
import { Sale } from "./entities/Sale";

// Create payment methods
const METHODS = [
  'Punto',
  'Pago móvil',
  'Transferencia',
  'Efectivo',
  'Zelle',
  'Paypal',
  'Binance'
]

const CURRENCIES = [
  ['Dólares', '$'],
  ['Bolívares', 'BSF' ]
]


export async function fillTestDatabase(connection: Connection) {

  const firstMethods = await connection.getRepository(PaymentMethod).find();
  if (firstMethods.length === 0) {

    let methods: PaymentMethod[] = [];
    METHODS.forEach(async methodName => {
      const method: PaymentMethod = await connection.getRepository(PaymentMethod).save({
        name: methodName}
      );
      methods.push(method);
    })
  
    let currencies: Currency[] = []; 
    CURRENCIES.forEach(async currencyList => {
      const currency: Currency = await connection.getRepository(Currency).save({
        name: currencyList[0], 
        symbol:currencyList[1]
      });
      currencies.push(currency);
    })
  
    const client = await connection.getRepository(Client).save({
      name: "Eduardo", 
      identity_card: "V-25899242",
      phone_number: "0424-816-7122",
      email: "eduardokiriakos@gmail.com"
    })

    const otherClient = await connection.getRepository(Client).save({
      name: "Eduardo Kiriakos", 
      identity_card: "V-25897242",
      phone_number: "0424-816-6122",
      email: "eduardokiriakos@hotmail.com"
    })
  
    const codo = await connection.getRepository(Product).save({
      name: "Codo de 1/2\"",
      price: 12.5,
      stock: 10
    })
  
    const tubo = await connection.getRepository(Product).save({
      name: "Tubo de 1/2\"",
      price: 5.0,
      stock: 5
    })
  
    const sale = await connection.getRepository(Sale).save({
      client: client,
      date: new Date(),
      description: "Esta es la primera venta"
    })
    
    const salePayment = await connection.getRepository(Payment).save({
      date: new Date,
      sale: sale,
      amount: 13.0,
      currency: currencies[0],
      method: methods[1],
      rate: 0,
    })
  
    const saleReturn = await connection.getRepository(Payment).save({
      date: new Date,
      sale: sale,
      amount: -2100000,
      currency: currencies[1],
      method: methods[2],
      rate: 4200000
    })
  
    const order = await connection.getRepository(Order).save({
      sale: sale,
      product: codo,
      amount: 1,
      date: new Date,
      price: codo.price
    })
  
    const paymentRepository = connection.getRepository(Payment);
    const payments = await paymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.sale", "sale")
      .where("sale.id = :id", { id: sale.id })
      .getMany();
    
      const otherSale = await connection.getRepository(Sale).save({
        client: client,
        date: new Date(),
        description: "Esta es la segunda venta"
      })

      const otherPayment = await connection.getRepository(Payment).save({
        date: new Date,
        sale: otherSale,
        amount: 50.0,
        currency: currencies[0],
        method: methods[1],
        rate: 0,
      })

      const lastSale = await connection.getRepository(Sale).save({
        date: new Date(),
        client: otherClient,
        description: "Esta es la última venta"
      })

      const lastPayment = await connection.getRepository(Payment).save({
        date: new Date,
        sale: lastSale,
        amount: 4129000,
        currency: currencies[1],
        method: methods[0],
        rate: 4129000,
      })
    }
}