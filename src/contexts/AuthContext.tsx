'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthorizedUser = (user: User | null): boolean => {
    return user?.email === 'randy.grullon@example.com' || user?.displayName === 'Randy Grullon';
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Check if user is authorized
      if (user && !isAuthorizedUser(user)) {
        // User is not authorized, sign them out
        signOut(auth);
        toast.error('Acceso denegado. Solo el administrador puede acceder al sistema.');
        setUser(null);
      } else {
        setUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user is authorized
      if (!isAuthorizedUser(user)) {
        await signOut(auth);
        toast.error('Acceso denegado. Solo el administrador puede acceder al sistema.');
        return;
      }
      
      toast.success('¡Bienvenido al panel de administración!');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};