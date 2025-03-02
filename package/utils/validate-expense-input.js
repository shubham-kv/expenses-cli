const validateExpenseInput = (params) => {
  const { name, amount, description } = params;

  if (!name && !amount && !description) {
    console.error(`<====== FAILURE ======>`);
    console.error(`Invalid options, at-least one option required.\n`);
    return false;
  }

  if (name !== undefined && name === "") {
    console.error(`<====== FAILURE ======>`);
    console.error(`Invalid name, cannot be empty.\n`);
    return false;
  }

  if (amount < 0) {
    console.error(`<====== FAILURE ======>`);
    console.error(`Invalid amount '${amount}', expected a positive number.\n`);
    return false;
  }

  if (description !== undefined && description === "") {
    console.error(`<====== FAILURE ======>`);
    console.error(`Invalid description, cannot be empty.\n`);
    return false;
  }

  return true;
};

module.exports = {
  validateExpenseInput,
};
