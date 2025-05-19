
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenses } from '@/context/ExpenseContext';
import { DollarSign } from 'lucide-react';

const ExpenseSummary: React.FC = () => {
  const { expenses } = useExpenses();

  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Calculate this month's expenses
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
    return expenseDate.getMonth() === currentDate.getMonth() && 
           expenseDate.getFullYear() === currentDate.getFullYear();
  });
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-r from-expense-primary to-expense-secondary text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Expenses</p>
              <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalAmount)}</h3>
              <p className="text-white/70 text-xs mt-2">All time</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-2 border-expense-light">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{currentMonth} Expenses</p>
              <h3 className="text-3xl font-bold mt-1 text-expense-dark">
                {formatCurrency(thisMonthTotal)}
              </h3>
              <p className="text-gray-400 text-xs mt-2">{currentMonth} {currentYear}</p>
            </div>
            <div className="bg-expense-light p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-expense-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
