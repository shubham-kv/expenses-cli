#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { name, description, version } from "../package.json";

import {
  addExpenseAction,
  deleteExpenseAction,
  listExpensesAction,
  updateExpenseAction,
  viewExpenseSummary,
} from "./actions";

const program = new Command()
  .name(name)
  .description(description)
  .version(version);

program
  .command("add")
  .argument("<name>", "Expense name")
  .description("Add a new expense")
  .option("-d, --description <description>", "Text describing the expense")
  .requiredOption("-a, --amount <amount>", "Expense amount, a positive number")
  .action(addExpenseAction);

program
  .command("edit")
  .argument("<id>", "Id of the expense to edit")
  .description("Edit an existing expense with the given id")
  .option("-n, --name <name>", "Expense name")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount, a positive number")
  .action(updateExpenseAction);

program
  .command("delete")
  .argument("<id>", "Id of the expense to delete")
  .description("Delete the expense with the given id")
  .action(deleteExpenseAction);

program
  .command("list")
  .description("List all the expenses")
  .action(listExpensesAction);

program
  .command("summary")
  .description("Get the summary of all expenses by month")
  .option(
    "-m, --month <month>",
    "Number within 1 (Jan) to 12 (Dec) of the current year for which to display the summary"
  )
  .action(viewExpenseSummary);

program.parse(process.argv);
