
import React from 'react';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { DollarSign, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const IndexPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Redirect to dashboard if user is logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-expense-primary p-2 rounded-lg mr-3">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Boost</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage your expenses</p>
          </div>
        </div>
        
        {currentUser && (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/add-transaction')}
              className="bg-expense-primary hover:bg-expense-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
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
        )}
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Welcome to Budget Boost</h2>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Track your expenses, manage your income, and take control of your finances
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full md:w-auto bg-expense-primary hover:bg-expense-dark"
              onClick={() => navigate('/')}
              size="lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        <p>Budget Boost © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <TransactionProvider>
          <IndexPage />
        </TransactionProvider>
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default Index;
