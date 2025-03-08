export type Expense = {
  id: string;
  name: string;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;
