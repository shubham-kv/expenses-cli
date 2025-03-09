import path from "path";
import fs from "fs/promises";
import {
  describe,
  expect,
  test,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";

import { addExpense, deleteExpense, updateExpense } from "./expenses";
import { Expense, ExpenseData } from "../../types";

const expenseStub = () => ({
  id: "12345",
  name: "Dummy Expense",
  amount: 30,
  description: "Dummy description",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("expense service", () => {
  const testExpensesFilePath = path.join(__dirname, "test-expenses.json");

  const writeAndDeleteTestExpenses = () => {
    beforeAll(async () => {
      await fs.writeFile(
        testExpensesFilePath,
        JSON.stringify([expenseStub()]),
        {
          flag: "w+",
          encoding: "utf-8",
        }
      );
    });

    afterAll(async () => {
      await fs.unlink(testExpensesFilePath);
    });
  };

  describe("addExpense", () => {
    describe("when addExpense is called and file doesn't exists", () => {
      test("should't throw ENOENT", async () => {
        await expect(
          addExpense(testExpensesFilePath, {
            name: expenseStub().name,
            amount: expenseStub().amount,
            description: expenseStub().description,
          })
        ).resolves.toBeDefined();
      });
    });

    describe("when addExpense is called and file exists", () => {
      let addExpenseData: ExpenseData;
      let addResult: Expense | undefined;

      writeAndDeleteTestExpenses();

      beforeEach(async () => {
        addExpenseData = {
          name: "Dummy Expense",
          amount: expenseStub().amount,
          description: expenseStub().description,
        };
        addResult = await addExpense(testExpensesFilePath, addExpenseData);
      });

      test("should add the expense to json file", async () => {
        const data = await fs.readFile(testExpensesFilePath, "utf-8");
        const allExpenses: Expense[] = data ? JSON.parse(data) : [];
        const foundExpense = allExpenses.find(
          (e) =>
            e.name === addExpenseData.name &&
            e.amount === addExpenseData.amount &&
            e.description === addExpenseData.description
        );
        expect(foundExpense).toBeDefined();
      });

      test("should return the saved expense", async () => {
        expect(addResult).toMatchObject(addExpenseData);
      });
    });
  });

  describe("updateExpense", () => {
    describe("when updateExpense is called with invalid id", () => {
      test("should return null", async () => {
        await expect(
          updateExpense(testExpensesFilePath, "INVALID", {
            name: expenseStub().name,
          })
        ).resolves.toBe(null);
      });
    });

    describe("when updateExpense is called with valid id", () => {
      let updateData: ExpenseData;
      let updateResult: Expense | null;

      writeAndDeleteTestExpenses();

      beforeEach(async () => {
        updateData = {
          name: "Updated Expense",
          amount: 149,
          description: "",
        };
        updateResult = await updateExpense(
          testExpensesFilePath,
          expenseStub().id,
          updateData
        );
      });

      test("should save the updated data to json file", async () => {
        const data = await fs.readFile(testExpensesFilePath, "utf-8");
        const allExpenses: Expense[] = data ? JSON.parse(data) : [];
        const foundExpense = allExpenses.find(
          (e) =>
            e.name === updateData.name &&
            e.amount === updateData.amount &&
            e.description === updateData.description
        );
        expect(foundExpense).toBeDefined();
      });

      test("should return the updated expense", async () => {
        expect(updateResult).toMatchObject(updateData);
      });
    });
  });

  describe("deleteExpense", () => {
    describe("when deleteExpense is called with invalid id", () => {
      test("should return null", async () => {
        await expect(
          deleteExpense(testExpensesFilePath, "INVALID")
        ).resolves.toBe(null);
      });
    });

    describe("when deleteExpense is called with valid id", () => {
      let deleteResult: Expense | null;

      writeAndDeleteTestExpenses();

      beforeAll(async () => {
        deleteResult = await deleteExpense(
          testExpensesFilePath,
          expenseStub().id,
        );
      });

      test("should remove the expense from json file", async () => {
        const data = await fs.readFile(testExpensesFilePath, "utf-8");
        const allExpenses: Expense[] = data ? JSON.parse(data) : [];
        const foundExpense = allExpenses.find((e) => e.id === expenseStub().id);
        expect(foundExpense).toBe(undefined)
      });

      test("should return the deleted expense", async () => {
        expect(deleteResult).toMatchObject({id: expenseStub().id});
      });
    });
  });
});
