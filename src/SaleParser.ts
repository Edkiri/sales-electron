import { Sale } from "./entities/Sale";
import * as dayjs from "dayjs";
import { Connection } from "typeorm";


export interface SaleMainListRow {
  id: number,
  state: string,
  description: string,
  total: number
}


function parseSales(sales: Sale[]): SaleMainListRow[] {
  let salesToPrint: SaleMainListRow[] = [];

  sales.forEach(sale => {
    let totalPays: number = 0;
    console.log("SALE ID: ", sale.id)
    sale.payments.forEach(pay => {
      console.log("PAYMENT AMOUNT: ", pay.amount, "TYPE: ", typeof pay.amount)
      if(pay.currency.id != 1) {
        const totalPay = pay.amount / pay.rate;
        totalPays += totalPay;
      } else {
        totalPays += pay.amount;
      }
      console.log("")
    })

    const saleToPrint = {
      id: sale.id,
      state: "Finalizado",
      description: sale.description,
      total: totalPays
    };

    salesToPrint.push(saleToPrint);
  })
  return salesToPrint;
}

export async function getDailySales (connection: Connection, date: Date): Promise<SaleMainListRow[]> {
  const targetDate = dayjs(date).toISOString();
  const todaySales: Sale[] = await connection.getRepository(Sale)
    .createQueryBuilder("sale")
    .leftJoinAndSelect("sale.payments", "payments")
    .leftJoinAndSelect("payments.currency", "currency")
    .where("sale.date = :date", { date: targetDate})
    .getMany();

  const salesToPrint = parseSales(todaySales);
  return salesToPrint;
}