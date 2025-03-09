import dateFns from "date-fns";
import Table from "cli-table3";

import { getAllExpenses } from "../lib/expenses";
import {
  getExpensesSummary,
  calculateTotalExpenses,
} from "../lib/expenses-calculation";
import { formatCurrency, validateViewSummaryOptions } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type ViewSummaryOptions = {
  month: number;
};

export async function viewExpenseSummary(options: ViewSummaryOptions) {
  const { month } = options;

  if (!validateViewSummaryOptions(options)) {
    return;
  }

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
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.\n`
    );
    return;
  }

  const summaryEntries = getExpensesSummary(allExpenses, {
    month,
    sort: "desc",
  });
  const shouldDisplayTotal = !month;

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
