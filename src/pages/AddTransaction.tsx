
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TransactionProvider } from '@/context/TransactionContext';
import TransactionForm from '@/components/TransactionForm';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Transaction</h1>
        <p className="text-gray-500 dark:text-gray-400">Record a new expense or income</p>
      </div>

      <TransactionForm />
    </div>
  );
};

const AddTransaction = () => {
  return (
    <TransactionProvider>
      <AddTransactionPage />
    </TransactionProvider>
  );
};

export default AddTransaction;
