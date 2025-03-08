import fs from "fs";
import fsPromises from "fs/promises";

import { generateNewId } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type ExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;

const expensesReadWriteWrapper = async <
  T extends (allExpenses: Expense[]) => R,
  R
>(
  mutateExpensesCallback: T
): Promise<R> => {
  try {
    const expensesJsonString = await fsPromises.readFile(
      expensesJsonFilePath,
      "utf-8"
    );

    const allExpenses: Expense[] = expensesJsonString
      ? JSON.parse(expensesJsonString)
      : [];

    const returnValue = mutateExpensesCallback(allExpenses);
    if (returnValue) {
      await fsPromises.writeFile(
        expensesJsonFilePath,
        JSON.stringify(allExpenses),
        "utf-8"
      );
    }

    return returnValue;
  } catch (e) {
    throw e;
  }
};

export const addExpense = (expense: ExpenseData): Promise<Expense> => {
  return expensesReadWriteWrapper((allExpenses) => {
    const now = new Date();
    const newExpense: Expense = {
      id: generateNewId(),
      name: expense.name ?? "",
      amount: expense.amount,
      description: expense.description ?? "",
      createdAt: now,
      updatedAt: now,
    };

    allExpenses.push(newExpense);
    return newExpense;
  });
};

export const updateExpense = (
  id: string,
  data: ExpenseData
): Promise<Expense | null> => {
  return expensesReadWriteWrapper((allExpenses) => {
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

export const deleteExpense = (id: string): Promise<Expense | null> => {
  return expensesReadWriteWrapper((allExpenses) => {
    const index = allExpenses.findIndex((e) => e.id === id);

    if (index < 0) {
      return null;
    }

    const [deletedExpense] = allExpenses.splice(index, 1);
    return deletedExpense;
  });
};

export const readExpenses = async () => {
  if (!fs.existsSync(expensesJsonFilePath)) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `No Expenses found, add your expenses with the 'add' command.\n`
    );
    return null;
  }

  let data: string;
  try {
    data = await fsPromises.readFile(expensesJsonFilePath, "utf-8");
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
