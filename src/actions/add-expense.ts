import { Command } from "@commander-js/extra-typings";
import { addExpense } from "../lib/expenses";
import { expensesJsonFilePath } from "../constants";
import { isNumString } from "../utils";

type AddExpenseCommand = Command<
  [string],
  {
    amount: string;
    description?: string | undefined;
  },
  {}
>;

export async function addExpenseAction(this: AddExpenseCommand): Promise<void> {
  const [name] = this.processedArgs;
  const { amount, description } = this.opts();

  if (name !== undefined && name === "") {
    this.error(`<====== FAILURE ======>\nInvalid name, cannot be empty.\n`);
  }

  if (!(isNumString(amount) && parseFloat(amount) > 0)) {
    this.error(
      `<====== FAILURE ======>\nInvalid amount, expected a valid positive number.\n`
    );
  }

  try {
    const newExpense = await addExpense(expensesJsonFilePath, {
      name,
      amount: parseFloat(amount),
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
