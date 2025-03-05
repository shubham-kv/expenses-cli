import fs from "fs";
import { validateExpenseInput, generateNewId } from "../utils";
import { expensesDataPath } from "../constants";
import { Expense } from "../types";

type AddExpenseOptions = Pick<Expense, 'amount'|'description'>;

export function addExpense(name: string, options: AddExpenseOptions) {
  const { amount, description } = options;

  if (!validateExpenseInput({ name, amount, description })) {
    return;
  }

  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
  }

  fs.readFile(expensesDataPath, "ascii", (err, data) => {
    if (err) throw err;
    const expenses = (data ? JSON.parse(data) : []) as Expense[];
    const now = new Date();

    const newExpense: Expense = {
      id: generateNewId(),
      name: name ?? "",
      amount: amount,
      description: description ?? "",
      createdAt: now,
      updatedAt: now,
    };

    expenses.push(newExpense);

    fs.writeFile(expensesDataPath, JSON.stringify(expenses, null, 2), (err) => {
      if (err) throw err;
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${newExpense.id}' was added.\n`);
    });
  });
}
