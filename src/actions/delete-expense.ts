import { Command } from "@commander-js/extra-typings";
import { deleteExpense } from "../lib/expenses";
import { expensesJsonFilePath } from "../constants";

type DeleteExpenseCommand = Command<[string], {}, {}>;

export async function deleteExpenseAction(this: DeleteExpenseCommand) {
  const [id] = this.processedArgs;

  try {
    const deletedExpense = await deleteExpense(expensesJsonFilePath, id);

    if (!deletedExpense) {
      console.error(`<====== FAILURE ======>`);
      console.error(`No Expense found with id '${id}'.\n`);
    } else {
      console.log(`<====== SUCCESS ======>`);
      console.log(`Expense with id '${deletedExpense.id}' was deleted.\n`);
    }
  } catch (e) {
    console.error(`<====== OOPS ======>`);
    console.error(`Something went wrong while updating expense`);
    console.error(e);
  }
}
