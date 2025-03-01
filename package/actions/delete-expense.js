const fs = require("fs");
const { expensesDataPath } = require("../constants");

const deleteExpense = async (id) => {
  if (!fs.existsSync(expensesDataPath)) {
    fs.writeFileSync(expensesDataPath, JSON.stringify([], null, 2));
    console.error(`<====== FAILURE ======>`);
    console.error(`No Expense found with id '${id}'`);
    return;
  }

  fs.readFile(expensesDataPath, "ascii", (err, data) => {
    if (err) throw err;
    const expenses = data ? JSON.parse(data.toString(), null, 2) : [];
    const expenseIndex = expenses.findIndex((e) => e.id === id);

    if (expenseIndex < 0) {
      console.error(`<====== FAILURE ======>`);
      console.error(`No Expense found with id '${id}'.`);
      return;
    }

    expenses.splice(expenseIndex, 1);

    fs.writeFile(expensesDataPath, JSON.stringify(expenses, null, 2), (err) => {
      if (err) throw err;
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${id}' was deleted.`);
    });
  });
};

module.exports = {
  deleteExpense,
};
