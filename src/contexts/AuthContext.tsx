import React, { createContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, isDevelopmentMode } from '../config/firebase';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock user for development mode
const createMockUser = (): User => ({
  uid: 'dev-user-123',
  email: 'developer@example.com',
  displayName: 'Developer User',
  photoURL: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=DEV',
  createdAt: Date.now(),
  lastLoginAt: Date.now(),
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (firebaseUser: FirebaseUser): Promise<User> => {
    if (isDevelopmentMode) {
      // In development mode, just return a mock user
      return createMockUser();
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };

        await setDoc(userRef, {
          ...newUser,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });

        // Also create initial user stats
        const statsRef = doc(db, 'userStats', firebaseUser.uid);
        await setDoc(statsRef, {
          uid: firebaseUser.uid,
          totalJudgments: 0,
          correctJudgments: 0,
          currentStreak: 0,
          bestStreak: 0,
          xp: 0,
          level: 1,
          rank: 'Novice Judge',
          updatedAt: serverTimestamp(),
        });

        return newUser;
      } else {
        // Update last login time
        const existingUser = userSnap.data() as User;
        await setDoc(userRef, {
          ...existingUser,
          lastLoginAt: serverTimestamp(),
        }, { merge: true });

        return {
          ...existingUser,
          lastLoginAt: Date.now(),
        };
      }
    } catch (error: unknown) {
      console.error('Firestore error:', error);
      
      // If it's a permission error, create a basic user object without Firestore
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isPermissionError = errorMessage.includes('Missing or insufficient permissions') || 
                               errorMessage.includes('permission-denied');
      
      if (isPermissionError) {
        console.warn('⚠️ Firestore permissions issue - using basic user data');
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        };
      }
      
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isDevelopmentMode) {
        // Mock authentication for development
        console.log("🔐 Mock authentication - simulating Google sign-in");
        const mockUser = createMockUser();
        setUser(mockUser);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const user = await createUserDocument(result.user);
      setUser(user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (isDevelopmentMode) {
        console.log("🔓 Mock sign out");
        setUser(null);
        return;
      }

      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isDevelopmentMode) {
      // In development mode, just set loading to false
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await createUserDocument(firebaseUser);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
