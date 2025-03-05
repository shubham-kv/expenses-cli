import { Expense } from "../types";

type GetExpensesSummaryOptions = {
  sort: "asc" | "desc";
  month?: number;
};

/**
 * Calculates the monthly expenses & returns a sorted array of tuples where the
 * first element of the tuple is the month & second element of the tuple is the
 * total expenses of that month.
 *
 * @param expenses The expenses list
 * @param options A Object containing the month filter & sort parameter
 * @returns The array of tuples in the form [month, totalMonthlyExpense]
 */
export const getExpensesSummary = (
  expenses: Expense[],
  options: GetExpensesSummaryOptions
): [string, number][] => {
  const summary: Record<string, number> = {};
  const { sort, month } = options ?? { sort: "asc" };
  let filteredExpenses = expenses;

  if (month && month >= 1 && month <= 12) {
    const now = new Date();

    filteredExpenses = expenses.filter((e) => {
      const timestampDate = new Date(e.createdAt);

      return (
        timestampDate.getMonth() === month - 1 &&
        timestampDate.getFullYear() === now.getFullYear()
      );
    });
  }

  filteredExpenses.forEach((e) => {
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
 * @param expenses The expenses array
 * @returns The sum of all expenses
 */
export const calculateTotalExpenses = (expenses: Expense[]) => {
  let totalExpenses = 0;
  expenses.forEach((e) => (totalExpenses += Number(e.amount)));
  return totalExpenses;
};
