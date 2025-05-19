
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type QuickExpenseProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  amount: number;
  onClick: () => void;
};

const QuickExpense: React.FC<QuickExpenseProps> = ({ icon, title, description, amount, onClick }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-expense-light text-expense-primary flex-shrink-0">
          {icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <Button 
          variant="outline" 
          className="flex-shrink-0 border-expense-primary text-expense-primary hover:bg-expense-light"
          onClick={onClick}
        >
          ${amount}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ExpenseCard: React.FC<{ onQuickExpense: (data: any) => void }> = ({ onQuickExpense }) => {
  const quickExpenseItems = [
    {
      icon: <span>🍔</span>,
      title: 'Lunch',
      description: 'Quick meal expense',
      amount: 15
    },
    {
      icon: <span>🚕</span>,
      title: 'Transport',
      description: 'Taxi or public transit',
      amount: 25
    },
    {
      icon: <span>🛒</span>,
      title: 'Groceries',
      description: 'Weekly shopping',
      amount: 50
    },
    {
      icon: <span>⛽</span>,
      title: 'Fuel',
      description: 'Gas for vehicle',
      amount: 40
    }
  ];

  const handleQuickExpense = (item: typeof quickExpenseItems[0]) => {
    onQuickExpense({
      amount: item.amount,
      description: item.title,
      category: item.title.toLowerCase(),
      date: new Date().toISOString().slice(0, 10)
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg">Quick Add</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
        {quickExpenseItems.map((item, index) => (
          <QuickExpense
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            amount={item.amount}
            onClick={() => handleQuickExpense(item)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
