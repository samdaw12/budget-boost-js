
import React from 'react';
import { ExpenseProvider, useExpenses } from '@/context/ExpenseContext';
import ExpenseForm from '@/components/ExpenseForm';
import TransactionList from '@/components/TransactionList';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseChart from '@/components/ExpenseChart';
import ExpenseCard from '@/components/ExpenseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DollarSign } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';

const ExpenseApp = () => {
  const { addExpense } = useExpenses();
  const { transactions } = useTransactions();

  const handleQuickExpense = (expenseData: any) => {
    addExpense(expenseData);
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-expense-primary p-2 rounded-lg mr-3">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Boost</h1>
            <p className="text-sm text-gray-500">Track and manage your expenses</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ExpenseSummary />
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <ExpenseCard onQuickExpense={handleQuickExpense} />
            <ExpenseChart />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionList transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="add">
          <div className="max-w-md mx-auto">
            <ExpenseForm />
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <footer className="text-center text-sm text-gray-500 pb-4">
        <p>Budget Boost © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ExpenseProvider>
      <TransactionList transactions={[]} />
      <ExpenseApp />
    </ExpenseProvider>
  );
};

export default Index;
