import fs from "fs";
import { validateExpenseInput } from "../utils";
import { expensesDataPath } from "../constants";
import { Expense } from "../types";

type UpdateExpenseOptions = Pick<Expense, "name" | "amount" | "description">;

export function updateExpense(id: string, options: UpdateExpenseOptions) {
  const { name, amount, description } = options;

  if (!validateExpenseInput({ name, amount, description })) {
    return;
  }

  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
    console.error(`<====== FAILURE ======>`);
    console.error(`No Expense found with id '${id}'.\n`);
    return;
  }

  fs.readFile(expensesDataPath, "ascii", (err, data) => {
    if (err) throw err;

    const expenses = (data ? JSON.parse(data) : []) as Expense[];
    const expense = expenses.find((e) => e.id === id);
    const now = new Date();

    if (!expense) {
      console.error(`<====== FAILURE ======>`);
      console.error(`No Expense found with id '${id}'.\n`);
      return;
    }

    if (name) expense.name = name;
    if (amount) expense.amount = amount;
    if (description) expense.description = description;
    expense.updatedAt = now;

    fs.writeFile(expensesDataPath, JSON.stringify(expenses, null, 2), (err) => {
      if (err) throw err;
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${expense.id}' was updated.\n`);
    });
  });
}
