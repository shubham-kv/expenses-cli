import fs from "fs";
import Table from "cli-table3";
import { formatCurrency } from "../utils";
import { expensesDataPath } from "../constants";
import { Expense } from "../types";

export function listExpenses() {
  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
  }

  fs.readFile(expensesDataPath, "ascii", async (err, data) => {
    if (err) throw err;
    const expenses = (data ? JSON.parse(data) : []) as Expense[];

    const table = new Table({
      head: ["No.", "Id", "Timestamp", "Name", "Amount", "Description"],
      style: { head: [], compact: true },
    });

    table.push(
      ...expenses.map((e, i) => [
        i + 1,
        e.id,
        new Date(e.createdAt).toLocaleString(),
        e.name,
        formatCurrency(e.amount),
        e.description,
      ])
    );

    console.log(table.toString());
  });
}
