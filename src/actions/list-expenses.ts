import Table from "cli-table3";
import { readExpenses } from "../lib/expenses";
import { formatCurrency } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

export async function listExpenses() {
  let expenses: Expense[] = [];
  const readExpensesResult = await readExpenses(expensesJsonFilePath);

  if (readExpensesResult) {
    expenses = readExpensesResult;
  } else {
    return;
  }

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

  console.log(table.toString() + "\n");
}
