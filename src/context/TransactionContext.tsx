
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  collection, addDoc, getDocs, query, orderBy, deleteDoc, 
  doc, where, updateDoc, Timestamp, DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

// Define types
export type TransactionType = 'expense' | 'income';
export type TransactionCategory = 'food' | 'transport' | 'housing' | 'utilities' | 'entertainment' | 'healthcare' | 'education' | 'salary' | 'investment' | 'gift' | 'other';
export type TransactionGroup = 'personal' | 'group';

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  type: TransactionType;
  group: TransactionGroup;
  groupName?: string;
  createdBy: string;
  createdByEmail?: string;
};

export type TransactionInput = Omit<Transaction, 'id' | 'date' | 'createdBy'> & {
  date: Date | string;
};

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, data: Partial<TransactionInput>) => Promise<void>;
  getExpenses: () => Transaction[];
  getIncomes: () => Transaction[];
  getPersonalTransactions: () => Transaction[];
  getGroupTransactions: () => Transaction[];
  isLoading: boolean;
  error: string | null;
};

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Context provider
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Fetch transactions from Firebase on component mount or when user changes
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
    }
    
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Get personal transactions
        const personalQuery = query(
          collection(db, 'transactions'),
          where('createdBy', '==', currentUser.uid),
          orderBy('date', 'desc')
        );
        
        // Get group transactions
        const groupQuery = query(
          collection(db, 'transactions'),
          where('group', '==', 'group'),
          orderBy('date', 'desc')
        );
        
        const [personalSnapshot, groupSnapshot] = await Promise.all([
          getDocs(personalQuery),
          getDocs(groupQuery)
        ]);
        
        const personalData = personalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        } as Transaction));
        
        const groupData = groupSnapshot.docs
          .filter(doc => doc.data().createdBy !== currentUser.uid) // Filter out own transactions
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate()
          } as Transaction));
        
        setTransactions([...personalData, ...groupData]);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
        toast.error("Failed to load transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  // Add new transaction
  const addTransaction = async (transaction: TransactionInput) => {
    if (!currentUser) {
      toast.error("You must be logged in to add transactions");
      return;
    }
    
    setIsLoading(true);
    try {
      // Add transaction to Firestore
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        amount: Number(transaction.amount),
        date: new Date(transaction.date),
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
      });
      
      // Update state with new transaction
      const newTransaction = {
        ...transaction,
        id: docRef.id,
        amount: Number(transaction.amount),
        date: new Date(transaction.date),
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success(`${transaction.type === 'expense' ? 'Expense' : 'Income'} added successfully!`);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction');
      toast.error("Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, data: Partial<TransactionInput>) => {
    setIsLoading(true);
    try {
      const transactionRef = doc(db, 'transactions', id);
      
      const updateData: Partial<DocumentData> = { ...data };
      if (data.date) {
        updateData.date = new Date(data.date);
      }
      if (data.amount) {
        updateData.amount = Number(data.amount);
      }
      
      await updateDoc(transactionRef, updateData);
      
      setTransactions(prev => prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...data, date: data.date ? new Date(data.date) : transaction.date } 
          : transaction
      ));
      
      toast.success("Transaction updated successfully!");
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction');
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'transactions', id));
      
      // Update state
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
      toast.error("Failed to delete transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to filter transactions
  const getExpenses = () => transactions.filter(t => t.type === 'expense');
  const getIncomes = () => transactions.filter(t => t.type === 'income');
  const getPersonalTransactions = () => transactions.filter(t => t.group === 'personal');
  const getGroupTransactions = () => transactions.filter(t => t.group === 'group');

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      updateTransaction,
      getExpenses,
      getIncomes,
      getPersonalTransactions,
      getGroupTransactions,
      isLoading, 
      error 
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

// Custom hook for using the context
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
