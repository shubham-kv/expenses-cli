const fs = require("fs");
const dateFns = require("date-fns");
const Table = require("cli-table3");

const {
  getExpensesSummary,
  calculateTotalExpenses,
} = require("../lib/expenses");

const { formatCurrency, validateViewSummaryOptions } = require("../utils");
const { expensesDataPath } = require("../constants");

const viewExpenseSummary = (options) => {
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
    const expenses = data ? JSON.parse(data.toString(), null, 2) : [];

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
      style: { head: {}, compact: true },
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
};

module.exports = {
  viewExpenseSummary,
};
