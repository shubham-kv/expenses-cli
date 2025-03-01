#!/usr/bin/env node

const { Command } = require("commander");
const { name, description, version } = require("../package.json");

const { addExpense, updateExpense } = require("./actions");

const program = new Command();

program.name(name).description(description).version(version);

program
  .command("add <name>")
  .description("Add an expense")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount")
  .action(addExpense);

program
  .command("edit <id>")
  .description("Edit an expense")
  .option("-n, --name <name>", "Name of the expense")
  .option("-d, --description <description>", "Text describing the expense")
  .option("-a, --amount <amount>", "Expense amount")
  .action(updateExpense);

program.parse(process.argv);
