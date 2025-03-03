/**
 * Calculates the monthly expenses & returns a sorted array of tuples where the
 * first element of the tuple is the month & second element of the tuple is the
 * total expenses of that month.
 *
 * @param {Array} expenses The expenses list
 * @param {String} sort Sort parameter either 'asc' | 'desc'
 * @returns The array of tuples in the form [month, amount]
 */
const getExpensesSummary = (expenses, sort = "asc") => {
  const summary = {};

  expenses.forEach((e) => {
    const timestampDate = new Date(e.createdAt);
    timestampDate.setDate(1);
    timestampDate.setHours(0, 0, 0, 0);

    const monthString = timestampDate.toJSON();
    const monthStringInSummary = monthString in summary;

    if (!monthStringInSummary) {
      summary[monthString] = Number(e.amount);
    } else {
      summary[monthString] += Number(e.amount);
    }
  });

  const summaryEntries = Object.entries(summary);

  summaryEntries.sort((a, b) => {
    if (a[0] < b[0]) {
      return sort === "asc" ? -1 : 1;
    } else if (a[0] > b[0]) {
      return sort === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  });

  return summaryEntries;
};

/**
 * Calculates and returns the sum of all the expenses.
 * @param {Array} expenses The expenses array
 * @returns The sum of all expenses
 */
const calculateTotalExpenses = (expenses) => {
  let totalExpenses = 0;
  expenses.forEach((e) => (totalExpenses += Number(e.amount)));
  return totalExpenses;
};

module.exports = {
  getExpensesSummary,
  calculateTotalExpenses,
};
