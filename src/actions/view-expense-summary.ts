import fs from "fs";
import dateFns from "date-fns";
import Table from "cli-table3";

import { getExpensesSummary, calculateTotalExpenses } from "../lib/expenses";
import { formatCurrency, validateViewSummaryOptions } from "../utils";
import { expensesDataPath } from "../constants";
import { Expense } from "../types";

type ViewSummaryOptions = {
  month: number;
};

export function viewExpenseSummary(options: ViewSummaryOptions) {
  const { month } = options;

  if (!validateViewSummaryOptions(options)) {
    return;
  }

  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.\n`
    );
    return;
  }

  fs.readFile(expensesDataPath, "ascii", async (err, data) => {
    if (err) throw err;
    const expenses = (data ? JSON.parse(data) : []) as Expense[];

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
  });
}
