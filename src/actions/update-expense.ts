import { updateExpense } from "../lib/expenses";
import { validateExpenseInput } from "../utils";
import { expensesJsonFilePath } from "../constants";
import { Expense } from "../types";

type UpdateExpenseOptions = Pick<Expense, "name" | "amount" | "description">;

export async function updateExpenseAction(
  id: string,
  options: UpdateExpenseOptions
) {
  if (!validateExpenseInput(options)) {
    return;
  }

  try {
    const updatedExpense = await updateExpense(
      expensesJsonFilePath,
      id,
      options
    );

    if (!updatedExpense) {
      console.error(`<====== FAILURE ======>`);
      console.error(`No Expense found with id '${id}'.\n`);
    } else {
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${updatedExpense.id}' was updated.\n`);
    }
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(`Something went wrong while updating expense`);
    console.error(e);
  }
}
