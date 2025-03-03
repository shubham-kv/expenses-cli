const validateViewSummaryOptions = (options) => {
  const { month } = options;

  if (typeof month === "number" && !(month >= 1 && month <= 12)) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `Invalid month, must be a number between 1 (for January) & 12 (for December).\n`
    );
    return false;
  }

  return true;
};

module.exports = {
  validateViewSummaryOptions,
};
