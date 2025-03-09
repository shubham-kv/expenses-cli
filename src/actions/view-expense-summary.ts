import dateFns from "date-fns";
import Table from "cli-table3";
import { Command } from "@commander-js/extra-typings";

import { getAllExpenses } from "../lib/expenses";
import {
  getExpensesSummary,
  calculateTotalExpenses,
} from "../lib/expenses-calculation";
import { formatCurrency, isIntegerString } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type ViewSummaryCommand = Command<[], { month?: string | undefined }, {}>;

export async function viewExpenseSummary(this: ViewSummaryCommand) {
  const { month } = this.opts();

  if (
    month !== undefined &&
    !(isIntegerString(month) && parseInt(month) >= 1 && parseInt(month) <= 12)
  ) {
    this.error(
      `<====== FAILURE ======>\nInvalid month, must be a number within 1 (Jan) to 12 (Dec).\n`
    );
  }

  let allExpenses: Expense[] | null;

  try {
    allExpenses = await getAllExpenses(expensesJsonFilePath);

    if (!allExpenses) {
      this.error(
        `<====== FAILURE ======>\nNo Expenses found, add your expenses with the 'add' command.\n`
      );
    }
  } catch (e) {
    this.error(
      `<====== OOPS ======>\nSomething went wrong while loading or parsing the data file.`
    );
  }

  if (allExpenses.length === 0) {
    this.error(
      `<====== FAILURE ======>\nNo Expenses found, add your expenses with the 'add' command.\n`
    );
  }

  const summaryEntries = getExpensesSummary(allExpenses, {
    sort: "desc",
    ...(month ? { month: parseInt(month) } : {}),
  });
  const shouldDisplayTotal = !month;

  if (summaryEntries.length === 0) {
    this.error(
      `<====== FAILURE ======>\nNo Expenses found for the given month in the current year.\n`
    );
  }

  const table = new Table({
    head: ["No.", "Month", "Expenses"],
    style: { head: [], compact: true },
  });

  table.push(
    ...summaryEntries.map(([month, totalMonthlyExpense], i) => [
      i + 1,
      dateFns.format(new Date(month), "MMM yyyy"),
      formatCurrency(totalMonthlyExpense),
    ])
  );

  if (shouldDisplayTotal) {
    const totalExpenses = calculateTotalExpenses(allExpenses);
    const formattedTotalExpenses = formatCurrency(totalExpenses);

    table.push(
      ...[
        [undefined, undefined, undefined],
        [undefined, "Total", formattedTotalExpenses],
      ]
    );
  }

  console.log(table.toString() + "\n");
}
