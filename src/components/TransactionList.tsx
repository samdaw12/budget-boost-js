
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTransactions, Transaction } from '@/context/TransactionContext';
import { Search, Receipt, X, TrendingDown, TrendingUp, User, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { deleteTransaction, isLoading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.groupName && transaction.groupName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.createdByEmail && transaction.createdByEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionTypeIcon = (type: 'expense' | 'income') => {
    return type === 'expense' ? (
      <TrendingDown className="h-3 w-3 text-red-500" />
    ) : (
      <TrendingUp className="h-3 w-3 text-green-500" />
    );
  };

  const getGroupTypeIcon = (group: 'personal' | 'group') => {
    return group === 'personal' ? (
      <User className="h-3 w-3 text-gray-500" />
    ) : (
      <Users className="h-3 w-3 text-blue-500" />
    );
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="bg-expense-primary text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Transactions
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
          {filteredTransactions.length > 0 ? (
            <div>
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1">
                        {getTransactionTypeIcon(transaction.type)}
                        {getGroupTypeIcon(transaction.group)}
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.type === 'expense' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                        }`}>
                          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                        </span>
                        {transaction.group === 'group' && transaction.groupName && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                            Group: {transaction.groupName}
                          </span>
                        )}
                        {transaction.createdByEmail && transaction.group === 'group' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-help">
                                  By: {transaction.createdByEmail.split('@')[0]}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{transaction.createdByEmail}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        onClick={() => deleteTransaction(transaction.id)}
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
              <Receipt className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
              {searchTerm ? (
                <p className="text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
              ) : (
                <>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Add your first transaction to get started</p>
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
