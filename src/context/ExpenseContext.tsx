
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

// Define types
export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
};

export type ExpenseInput = Omit<Expense, 'id' | 'date'> & {
  date: Date | string;
};

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: ExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Context provider
export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses from Firebase on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const expenseData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        } as Expense));
        
        setExpenses(expenseData);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expenses');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load expenses. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Add new expense
  const addExpense = async (expense: ExpenseInput) => {
    setIsLoading(true);
    try {
      // Add expense to Firestore
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expense,
        amount: Number(expense.amount),
        date: new Date(expense.date)
      });
      
      // Update state with new expense
      const newExpense = {
        ...expense,
        id: docRef.id,
        amount: Number(expense.amount),
        date: new Date(expense.date)
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: "Success",
        description: "Expense added successfully!",
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'expenses', id));
      
      // Update state
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: "Success",
        description: "Expense deleted successfully!",
      });
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, isLoading, error }}>
      {children}
    </ExpenseContext.Provider>
  );
}

// Custom hook for using the context
export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
