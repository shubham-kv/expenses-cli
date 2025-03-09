export type Expense = {
  id: string;
  name: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AddExpenseData = Pick<Expense, "name" | "amount"> &
  Partial<Pick<Expense, "description">>;
export type ExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;
