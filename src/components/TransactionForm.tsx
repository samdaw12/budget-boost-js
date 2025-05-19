
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TransactionCategory, TransactionInput, useTransactions } from '@/context/TransactionContext';
import { DollarSign, TrendingDown, TrendingUp, User, Users } from 'lucide-react';

const categories: { value: TransactionCategory; label: string; type: 'expense' | 'income' | 'both' }[] = [
  { value: 'food', label: 'Food', type: 'expense' },
  { value: 'transport', label: 'Transport', type: 'expense' },
  { value: 'housing', label: 'Housing', type: 'expense' },
  { value: 'utilities', label: 'Utilities', type: 'expense' },
  { value: 'entertainment', label: 'Entertainment', type: 'expense' },
  { value: 'healthcare', label: 'Healthcare', type: 'expense' },
  { value: 'education', label: 'Education', type: 'expense' },
  { value: 'salary', label: 'Salary', type: 'income' },
  { value: 'investment', label: 'Investment', type: 'income' },
  { value: 'gift', label: 'Gift', type: 'both' },
  { value: 'other', label: 'Other', type: 'both' },
];

const TransactionForm: React.FC = () => {
  const { addTransaction, isLoading } = useTransactions();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TransactionInput>({
    amount: 0,
    description: '',
    category: 'other',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    group: 'personal',
    groupName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as TransactionCategory }));
  };

  const handleTypeChange = (value: string) => {
    if (value) {
      setFormData(prev => ({ ...prev, type: value as 'expense' | 'income' }));
    }
  };

  const handleGroupChange = (value: string) => {
    if (value) {
      setFormData(prev => ({ ...prev, group: value as 'personal' | 'group' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction(formData);
    navigate('/dashboard');
  };

  // Filter categories based on the selected type
  const filteredCategories = categories.filter(
    category => category.type === formData.type || category.type === 'both'
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-expense-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          {formData.type === 'expense' ? (
            <TrendingDown className="h-5 w-5" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
          Add {formData.type === 'expense' ? 'Expense' : 'Income'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <ToggleGroup 
              type="single" 
              value={formData.type}
              onValueChange={handleTypeChange} 
              className="justify-start"
            >
              <ToggleGroupItem value="expense" className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Expense
              </ToggleGroupItem>
              <ToggleGroupItem value="income" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Income
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Transaction Group</Label>
            <ToggleGroup 
              type="single" 
              value={formData.group}
              onValueChange={handleGroupChange} 
              className="justify-start"
            >
              <ToggleGroupItem value="personal" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Personal
              </ToggleGroupItem>
              <ToggleGroupItem value="group" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Group
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {formData.group === 'group' && (
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                name="groupName"
                placeholder="Enter group name"
                value={formData.groupName}
                onChange={handleChange}
                required={formData.group === 'group'}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={handleChange}
                className="pl-10"
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="What was this transaction for?"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={typeof formData.date === 'string' ? formData.date : formData.date.toISOString().slice(0, 10)}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-expense-primary hover:bg-expense-dark"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Transaction'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionForm;
