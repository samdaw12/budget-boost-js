
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { toast } from '@/components/ui/sonner';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtj7_PdfdT6nR-jFlBH5Ry-NXcvvy5eSk",
  authDomain: "expense-tracker-demo-e936b.firebaseapp.com",
  projectId: "expense-tracker-demo-e936b",
  storageBucket: "expense-tracker-demo-e936b.appspot.com",
  messagingSenderId: "594451871031",
  appId: "1:594451871031:web:744bc3fd583efa9fb2c837"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Auth functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    toast.success("Account created successfully!");
    return userCredential.user;
  } catch (error: any) {
    toast.error(error.message || "Failed to create account");
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!");
    return userCredential.user;
  } catch (error: any) {
    toast.error(error.message || "Failed to login");
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to logout");
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent!");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to send reset email");
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    
    await updatePassword(user, newPassword);
    toast.success("Password updated successfully!");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to update password");
    throw error;
  }
};

export { db, auth };
