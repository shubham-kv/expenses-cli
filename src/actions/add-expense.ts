import { addExpense } from "../lib/expenses";
import { validateExpenseInput } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type AddExpenseOptions = Pick<Expense, "amount" | "description">;

export async function addExpenseAction(
  name: string,
  options: AddExpenseOptions
) {
  const { amount, description } = options;

  if (!validateExpenseInput({ name, amount, description })) {
    return;
  }

  try {
    const newExpense = await addExpense(expensesJsonFilePath, {
      name,
      amount,
      description,
    });
    console.log(`<====== SUCCESS ======>`);
    console.log(`Expense with id '${newExpense.id}' was added.\n`);
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(`Something went wrong while adding expense`);
    console.error(e);
  }
}
