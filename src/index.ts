#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import { name, description, version } from "../package.json";

import {
  addExpenseAction,
  updateExpense,
  deleteExpense,
  listExpenses,
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
  .requiredOption(
    "-a, --amount <amount>",
    "Expense amount, a positive number"
  )
  // @ts-ignore
  .action(addExpenseAction);

program
  .command("edit <id>")
  .description("Edit an existing expense with the given id.")
  .option("-n, --name <name>", "Name of the expense")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount", parseFloat)
  // @ts-ignore
  .action(updateExpense);

program
  .command("delete <id>")
  .description("Delete an expense with the given id.")
  .action(deleteExpense);

program
  .command("list")
  .description("List all the expenses")
  .action(listExpenses);

program
  .command("summary")
  .description("Get the summary of your expenses by month")
  .option(
    "-m, --month <month>",
    "Number representing the month of the current year to show the summary for, from 1 - 12, 1 for January, 12 for December",
    parseInt
  )
  // @ts-ignore
  .action(viewExpenseSummary);

program.parse(process.argv);
