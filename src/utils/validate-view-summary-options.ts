type ValidateViewSummaryParams = {
  month: number;
};

export const validateViewSummaryOptions = (
  params: ValidateViewSummaryParams
): boolean => {
  const { month } = params;

  if (typeof month === "number" && !(month >= 1 && month <= 12)) {
    console.error(`<====== FAILURE ======>`);
    console.error(
      `Invalid month, must be a number between 1 (for January) & 12 (for December).\n`
    );
    return false;
  }

  return true;
};
