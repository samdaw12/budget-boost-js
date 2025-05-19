
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses } from '@/context/ExpenseContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const COLORS = [
  '#38B2AC', // teal
  '#4FD1C5', // teal lighter
  '#2C7A7B', // teal darker
  '#0BC5EA', // cyan
  '#76E4F7', // cyan lighter
  '#0987A0', // cyan darker
  '#9F7AEA', // purple
  '#805AD5', // purple darker
];

const ExpenseChart: React.FC = () => {
  const { expenses } = useExpenses();

  // Prepare data for category chart
  const categoryData = useMemo(() => {
    if (!expenses.length) return [];

    const categories: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const category = expense.category;
      categories[category] = (categories[category] || 0) + expense.amount;
    });

    return Object.keys(categories).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categories[category]
    }));
  }, [expenses]);

  // Prepare data for monthly chart
  const monthlyData = useMemo(() => {
    if (!expenses.length) return [];

    const last6Months: { [key: string]: number } = {};
    const today = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      last6Months[monthKey] = 0;
    }

    // Fill with expense data
    expenses.forEach(expense => {
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      const monthDiff = (today.getFullYear() - expenseDate.getFullYear()) * 12 + today.getMonth() - expenseDate.getMonth();
      
      if (monthDiff >= 0 && monthDiff < 6) {
        const monthKey = expenseDate.toLocaleString('default', { month: 'short' });
        last6Months[monthKey] = (last6Months[monthKey] || 0) + expense.amount;
      }
    });

    return Object.keys(last6Months).map(month => ({
      name: month,
      amount: last6Months[month]
    }));
  }, [expenses]);

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${formatTooltipValue(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#38B2AC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatTooltipValue(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseChart;
