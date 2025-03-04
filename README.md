
# expenses-cli

Simple CLI tool to manage your expenses.

## Get Started

Install the package globally with `npm` or from a package manager of your liking.

```bash
npm install --global @shubhamkv/expenses-cli
```

## Usage

Add your expenses with the `expenses add` command:

```bash
expenses add Lunch --amount 20                   
```

Optionally include a description with the `-d` or `--description` option:

```bash
expenses add Lunch --amount 20 --description "Lunch at a restaurant near office"
```

View all of your expenses with `expenses list`:

```bash
expenses list
```

Update `name`, `amount` & `description` of the expense with `expenses edit`
command passing in the expense's id.

If `7LNjEL1K` is the id of the expense you would do the following to update it's amount:

```bash
expenses edit 7LNjEL1K --amount 25
```

Delete unwanted ones with the `expenses delete` command:

```bash
expenses delete 7LNjEL1S
```

Get a monthly summary of your expenses:

```bash
expenses summary
```

## Credits

Inspired from [Roadmap.sh | Expense tracker](https://roadmap.sh/projects/expense-tracker).
