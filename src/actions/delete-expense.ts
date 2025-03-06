import fs from "fs";
import { expensesDataPath } from "../constants";
import { Expense } from "../types";

export function deleteExpense(id: string) {
  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
    console.error(`<====== FAILURE ======>`);
    console.error(`No Expense found with id '${id}'.\n`);
    return;
  }

  fs.readFile(expensesDataPath, "ascii", (err, data) => {
    if (err) throw err;
    const expenses = (data ? JSON.parse(data) : []) as Expense[];
    const expenseIndex = expenses.findIndex((e) => e.id === id);

    if (expenseIndex < 0) {
      console.error(`<====== FAILURE ======>`);
      console.error(`No Expense found with id '${id}'.\n`);
      return;
    }

    expenses.splice(expenseIndex, 1);

    fs.writeFile(expensesDataPath, JSON.stringify(expenses, null, 2), (err) => {
      if (err) throw err;
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${id}' was deleted.\n`);
    });
  });
}
