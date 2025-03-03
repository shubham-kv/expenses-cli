const fs = require("fs");
const dateFns = require("date-fns");
const Table = require("cli-table3");

const { getExpensesSummary, calculateTotalExpenses } = require("../lib/expenses");
const { formatCurrency } = require("../utils");
const { expensesDataPath } = require("../constants");

const viewExpenseSummary = () => {
  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.`
    );
    return;
  }

  fs.readFile(expensesDataPath, "ascii", async (err, data) => {
    if (err) throw err;
    const expenses = data ? JSON.parse(data.toString(), null, 2) : [];

    if (expenses.length === 0) {
      console.error(`<====== FAILURE ======>`);
      console.error(
        `No Expenses found, add your expenses with the 'add' command.`
      );
      return;
    }

    const summaryEntries = getExpensesSummary(expenses, 'desc')
    const totalExpenses = calculateTotalExpenses(expenses)
    const formattedTotalExpenses = formatCurrency(totalExpenses);

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

    table.push(
      ...[
        [undefined, undefined, undefined],
        [undefined, "Total", formattedTotalExpenses],
      ]
    );

    console.log(table.toString());
  });
};

module.exports = {
  viewExpenseSummary,
};
