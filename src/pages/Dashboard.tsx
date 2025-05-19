
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionProvider, useTransactions } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  LogOut, 
  Settings, 
  Plus,
  TrendingUp,
  TrendingDown,
  User,
  Users
} from 'lucide-react';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseChart from '@/components/ExpenseChart';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';

const DashboardContent = () => {
  const { currentUser, logout } = useAuth();
  const { transactions, isLoading, getExpenses, getIncomes, getPersonalTransactions, getGroupTransactions } = useTransactions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const personalExpenses = getPersonalTransactions().filter(t => t.type === 'expense');
  const personalIncomes = getPersonalTransactions().filter(t => t.type === 'income');
  const groupExpenses = getGroupTransactions().filter(t => t.type === 'expense');
  const groupIncomes = getGroupTransactions().filter(t => t.type === 'income');

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-expense-primary p-2 rounded-lg mr-3">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Boost</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {currentUser?.email || 'User'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <ExpenseSummary />
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <ExpenseChart />
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/add-transaction')}
                className="bg-expense-primary hover:bg-expense-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="expenses">
                <TrendingDown className="h-4 w-4 mr-1" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="incomes">
                <TrendingUp className="h-4 w-4 mr-1" />
                Incomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TransactionList transactions={transactions} />
            </TabsContent>

            <TabsContent value="expenses">
              <TransactionList transactions={getExpenses()} />
            </TabsContent>

            <TabsContent value="incomes">
              <TransactionList transactions={getIncomes()} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="personal">
          <Tabs defaultValue="personal-expenses">
            <TabsList className="mb-4">
              <TabsTrigger value="personal-expenses">
                <User className="h-4 w-4 mr-1" />
                <TrendingDown className="h-3 w-3 mr-1" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="personal-incomes">
                <User className="h-4 w-4 mr-1" />
                <TrendingUp className="h-3 w-3 mr-1" />
                Incomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal-expenses">
              <TransactionList transactions={personalExpenses} />
            </TabsContent>

            <TabsContent value="personal-incomes">
              <TransactionList transactions={personalIncomes} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="group">
          <Tabs defaultValue="group-expenses">
            <TabsList className="mb-4">
              <TabsTrigger value="group-expenses">
                <Users className="h-4 w-4 mr-1" />
                <TrendingDown className="h-3 w-3 mr-1" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="group-incomes">
                <Users className="h-4 w-4 mr-1" />
                <TrendingUp className="h-3 w-3 mr-1" />
                Incomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="group-expenses">
              <TransactionList transactions={groupExpenses} />
            </TabsContent>

            <TabsContent value="group-incomes">
              <TransactionList transactions={groupIncomes} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pb-4">
        <p>Budget Boost © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const Dashboard = () => {
  return (
    <TransactionProvider>
      <DashboardContent />
    </TransactionProvider>
  );
};

export default Dashboard;
