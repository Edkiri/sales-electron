import { Connection } from "typeorm";
import { Sale } from "../database/entities/Sale";
import * as dayjs from "dayjs";

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
    sale.payments.forEach(pay => {
      if(pay.currency.id != 1) {
        const totalPay = pay.amount / pay.rate;
        totalPays += totalPay;
      } else {
        totalPays += pay.amount;
      }
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