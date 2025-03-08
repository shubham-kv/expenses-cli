import fs from "fs/promises";
import { existsSync, PathLike } from "fs";

import { generateNewId } from "../../utils";
import { Expense, ExpenseData } from "../../types";

const expensesReadWriteWrapper = async <
  T extends (allExpenses: Expense[]) => R,
  R
>(
  expensesFilePath: PathLike,
  mutateExpensesCallback: T
): Promise<R> => {
  try {
    const expensesJsonString = await fs.readFile(expensesFilePath, {
      encoding: "utf-8",
      flag: "a+",
    });

    const allExpenses: Expense[] = expensesJsonString
      ? JSON.parse(expensesJsonString)
      : [];

    const returnValue = mutateExpensesCallback(allExpenses);
    if (returnValue) {
      await fs.writeFile(
        expensesFilePath,
        JSON.stringify(allExpenses),
        "utf-8"
      );
    }

    return returnValue;
  } catch (e) {
    throw e;
  }
};

export const addExpense = (
  expensesFilePath: PathLike,
  expenseToAdd: ExpenseData
): Promise<Expense> => {
  return expensesReadWriteWrapper(expensesFilePath, (allExpenses) => {
    const now = new Date();
    const newExpense: Expense = {
      id: generateNewId(),
      name: expenseToAdd.name ?? "",
      amount: expenseToAdd.amount,
      description: expenseToAdd.description ?? "",
      createdAt: now,
      updatedAt: now,
    };

    allExpenses.push(newExpense);
    return newExpense;
  });
};

export const updateExpense = (
  expensesFilePath: PathLike,
  id: string,
  data: ExpenseData
): Promise<Expense | null> => {
  return expensesReadWriteWrapper(expensesFilePath, (allExpenses) => {
    const expense = allExpenses.find((e) => e.id === id);

    if (!expense) {
      return null;
    }

    if (data.name !== undefined) {
      expense.name = data.name;
    }
    if (data.amount !== undefined && !Number.isNaN(data.amount)) {
      expense.amount = data.amount;
    }
    if (data.description !== undefined) {
      expense.description = data.description;
    }
    expense.updatedAt = new Date();

    return expense;
  });
};

export const deleteExpense = (
  expensesFilePath: PathLike,
  id: string
): Promise<Expense | null> => {
  return expensesReadWriteWrapper(expensesFilePath, (allExpenses) => {
    const index = allExpenses.findIndex((e) => e.id === id);

    if (index < 0) {
      return null;
    }

    const [deletedExpense] = allExpenses.splice(index, 1);
    return deletedExpense;
  });
};

export const readExpenses = async (expensesFilePath: PathLike) => {
  if (!existsSync(expensesFilePath)) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.\n`
    );
    return null;
  }

  let data: string;
  try {
    data = await fs.readFile(expensesFilePath, "utf-8");
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(`Something went wrong while loading the data file.`);
    console.error(e);
    return null;
  }

  let parsedExpenses: Expense[];
  try {
    parsedExpenses = JSON.parse(data);
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(`Something went wrong while parsing the saved data.`);
    console.error(e);
    return null;
  }

  return parsedExpenses;
};
