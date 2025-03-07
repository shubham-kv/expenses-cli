import dateFns from "date-fns";
import Table from "cli-table3";

import { readExpenses } from "../lib/expenses-io";
import { getExpensesSummary, calculateTotalExpenses } from "../lib/expenses";
import { formatCurrency, validateViewSummaryOptions } from "../utils";
import { Expense } from "../types";

type ViewSummaryOptions = {
  month: number;
};

export async function viewExpenseSummary(options: ViewSummaryOptions) {
  const { month } = options;

  if (!validateViewSummaryOptions(options)) {
    return;
  }

  let expenses: Expense[] = [];
  const readExpensesResult = await readExpenses();

  if (readExpensesResult) {
    expenses = readExpensesResult;
  } else {
    return;
  }

  if (expenses.length === 0) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.\n`
    );
    return;
  }

  const summaryEntries = getExpensesSummary(expenses, {
    month,
    sort: "desc",
  });
  const shouldDisplayTotal = !month;
  const totalExpenses = calculateTotalExpenses(expenses);
  const formattedTotalExpenses = formatCurrency(totalExpenses);

  if (summaryEntries.length === 0) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found for the given month in the current year.\n`
    );
    return;
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
    table.push(
      ...[
        [undefined, undefined, undefined],
        [undefined, "Total", formattedTotalExpenses],
      ]
    );
  }

  console.log(table.toString() + "\n");
}
