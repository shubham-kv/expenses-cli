import { Command } from "@commander-js/extra-typings";

import { updateExpense } from "../lib/expenses";
import { expensesJsonFilePath } from "../constants";
import { isNumString } from "../utils";

type UpdateExpenseCommand = Command<
  [string],
  {
    name?: string | undefined;
    description?: string | undefined;
    amount?: string | undefined;
  },
  {}
>;

export async function updateExpenseAction(
  this: UpdateExpenseCommand
): Promise<void> {
  const [id] = this.processedArgs;
  const { name, amount, description } = this.opts();

  if (!name && !amount && !description) {
    this.error(
      `<====== FAILURE ======>\nInvalid options, at-least one option required.\n`
    );
  }

  if (name !== undefined && name === "") {
    this.error(`<====== FAILURE ======>\nInvalid name, cannot be empty.\n`);
  }

  if (
    amount !== undefined &&
    !(isNumString(amount) && parseFloat(amount) > 0)
  ) {
    this.error(
      `<====== FAILURE ======>\nInvalid amount, expected a valid positive number.\n`
    );
  }

  try {
    const updatedExpense = await updateExpense(expensesJsonFilePath, id, {
      name,
      description,
      ...(amount ? { amount: parseFloat(amount) } : {}),
    });

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
