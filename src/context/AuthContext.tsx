import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserAccessibilityProfile,
  SavedUserDocument,
  AccessibilityNeed,
} from '../types/auth';
import { TransformedDocument } from '../types/accessibility';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (
    name: string,
    email: string,
    password?: string,
    primaryNeed?: AccessibilityNeed
  ) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoUser: () => void;
  logout: () => void;
  updateProfile: (profileUpdates: Partial<UserAccessibilityProfile>) => void;
  savedDocuments: SavedUserDocument[];
  saveDocument: (docData: TransformedDocument, originalText: string) => Promise<boolean>;
  deleteDocument: (docId: string) => Promise<boolean>;
}

const DEFAULT_PROFILE: UserAccessibilityProfile = {
  primaryNeed: 'general',
  theme: 'default',
  fontFamily: 'hyperlegible',
  fontSize: 100,
  dyslexiaMode: false,
  bionicMode: false,
  readingRuler: false,
  voiceSpeed: 1.0,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedDocuments, setSavedDocuments] = useState<SavedUserDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('clarifyai_user');
      const storedDocs = localStorage.getItem('clarifyai_saved_docs');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedDocs) {
        setSavedDocuments(JSON.parse(storedDocs));
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync state to localStorage whenever changed
  useEffect(() => {
    if (user) {
      localStorage.setItem('clarifyai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('clarifyai_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('clarifyai_saved_docs', JSON.stringify(savedDocuments));
  }, [savedDocuments]);

  // Sign Up
  const signup = async (
    name: string,
    email: string,
    password?: string,
    primaryNeed: AccessibilityNeed = 'general'
  ) => {
    if (!name.trim() || !email.trim()) {
      return { success: false, error: 'Name and email are required.' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Configure profile presets based on accessibility needs
    const customProfile: UserAccessibilityProfile = {
      ...DEFAULT_PROFILE,
      primaryNeed,
      fontFamily:
        primaryNeed === 'dyslexia'
          ? 'dyslexic'
          : primaryNeed === 'low_vision'
          ? 'hyperlegible'
          : 'hyperlegible',
      fontSize: primaryNeed === 'low_vision' ? 120 : 100,
      theme: primaryNeed === 'low_vision' ? 'yellow-black' : 'default',
      dyslexiaMode: primaryNeed === 'dyslexia',
      bionicMode: primaryNeed === 'adhd',
      readingRuler: primaryNeed === 'dyslexia' || primaryNeed === 'adhd',
    };

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      profile: customProfile,
    };

    setUser(newUser);

    // Try optional sync to server API
    try {
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, profile: customProfile }),
      }).catch(() => {});
    } catch (e) {}

    return { success: true };
  };

  // Log In
  const login = async (email: string, _password?: string) => {
    if (!email.trim() || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Check if user matches stored user or create profile
    const existing = localStorage.getItem('clarifyai_user');
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email === email.trim().toLowerCase()) {
        setUser(parsed);
        return { success: true };
      }
    }

    // If new login without prior signup, generate standard user
    const loggedUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      profile: DEFAULT_PROFILE,
    };

    setUser(loggedUser);
    return { success: true };
  };

  // Instant Demo Account Login
  const loginDemoUser = () => {
    const demoUser: User = {
      id: 'demo-user-123',
      name: 'Alex Johnson',
      email: 'alex.accessibility@example.com',
      createdAt: new Date().toISOString(),
      profile: {
        primaryNeed: 'adhd',
        theme: 'default',
        fontFamily: 'hyperlegible',
        fontSize: 100,
        dyslexiaMode: false,
        bionicMode: true,
        readingRuler: true,
        voiceSpeed: 1.0,
      },
    };

    setUser(demoUser);
  };

  // Log Out
  const logout = () => {
    setUser(null);
  };

  // Update Accessibility Profile
  const updateProfile = (profileUpdates: Partial<UserAccessibilityProfile>) => {
    if (!user) return;
    setUser({
      ...user,
      profile: {
        ...user.profile,
        ...profileUpdates,
      },
    });
  };

  // Save Document
  const saveDocument = async (docData: TransformedDocument, originalText: string) => {
    const newSavedDoc: SavedUserDocument = {
      id: `doc_${Date.now()}`,
      userId: user?.id || 'guest',
      title: docData.title,
      documentType: docData.documentType,
      originalGrade: docData.originalReadingGrade,
      simplifiedGrade: docData.simplifiedReadingGrade,
      oneSentenceSummary: docData.oneSentenceSummary,
      savedAt: new Date().toISOString(),
      originalText,
      data: docData,
    };

    setSavedDocuments((prev) => [newSavedDoc, ...prev]);
    return true;
  };

  // Delete Document
  const deleteDocument = async (docId: string) => {
    setSavedDocuments((prev) => prev.filter((d) => d.id !== docId));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signup,
        login,
        loginDemoUser,
        logout,
        updateProfile,
        savedDocuments,
        saveDocument,
        deleteDocument,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
