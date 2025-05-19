
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useExpenses } from '@/context/ExpenseContext';
import { Search, Receipt, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TransactionList: React.FC = () => {
  const { expenses, deleteExpense, isLoading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="bg-expense-primary text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 bg-white text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          {filteredExpenses.length > 0 ? (
            <div>
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-expense-light text-expense-dark">
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {expense.date instanceof Date 
                            ? formatDistanceToNow(expense.date, { addSuffix: true })
                            : formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => deleteExpense(expense.id)}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Receipt className="h-12 w-12 text-gray-300 mb-2" />
              {searchTerm ? (
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
              ) : (
                <>
                  <p className="text-gray-500 font-medium">No transactions yet</p>
                  <p className="text-gray-400 text-sm">Add your first expense to get started</p>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
