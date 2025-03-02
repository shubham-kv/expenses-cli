#!/usr/bin/env node

const { Command } = require("commander");
const { name, description, version } = require("../package.json");

const {
  addExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
} = require("./actions");

const program = new Command();

program.name(name).description(description).version(version);

program
  .command("add <name>")
  .description("Add a new expense.")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount")
  .action(addExpense);

program
  .command("edit <id>")
  .description("Edit an existing expense with the given id.")
  .option("-n, --name <name>", "Name of the expense")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount")
  .action(updateExpense);

program
  .command("delete <id>")
  .description("Delete an expense with the given id.")
  .action(deleteExpense);

program
  .command("list")
  .description("List all the expenses")
  .action(listExpenses);

program.parse(process.argv);
