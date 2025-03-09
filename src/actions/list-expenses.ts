import { Command } from "@commander-js/extra-typings";
import Table from "cli-table3";

import { getAllExpenses } from "../lib/expenses";
import { formatCurrency } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type ListExpenseCommand = Command<[], {}, {}>;

export async function listExpensesAction(this: ListExpenseCommand) {
  let allExpenses: Expense[] | null;

  try {
    allExpenses = await getAllExpenses(expensesJsonFilePath);

    if (!allExpenses) {
      console.error(`<====== FAILURE ======>`);
      console.error(
        `No Expenses found, add your expenses with the 'add' command.\n`
      );
      return;
    }
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(
      `Something went wrong while loading or parsing the data file.`
    );
    return;
  }

  if (allExpenses.length === 0) {
    this.error(
      `<====== FAILURE ======>\nNo Expenses found, add your expenses with the 'add' command.\n`
    );
  }

  const table = new Table({
    head: ["No.", "Id", "Timestamp", "Name", "Amount", "Description"],
    style: { head: [], compact: true },
  });

  table.push(
    ...allExpenses.map((e, i) => [
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
