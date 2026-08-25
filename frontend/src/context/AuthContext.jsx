import React, { createContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);

  let clerkData = null;
  let clerkInstance = null;

  try {
    clerkData = useUser();
    clerkInstance = useClerk();
  } catch (e) {
    // ClerkProvider is inactive or not mounted
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('rtbs_user');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('rtbs_user');
      }
    }
    setLocalLoading(false);
  }, []);

  const login = (userData) => {
    setLocalUser(userData);
    localStorage.setItem('rtbs_user', JSON.stringify(userData));
  };

  const logout = () => {
    if (clerkInstance && clerkInstance.signOut) {
      clerkInstance.signOut();
    }
    setLocalUser(null);
    localStorage.removeItem('rtbs_user');
  };

  // Resolved user object: Clerk user takes precedence if signed in via Clerk
  const activeUser = (clerkData && clerkData.isSignedIn && clerkData.user)
    ? {
        _id: clerkData.user.id,
        id: clerkData.user.id,
        name: clerkData.user.fullName || clerkData.user.firstName || clerkData.user.primaryEmailAddress?.emailAddress || 'Passenger',
        email: clerkData.user.primaryEmailAddress?.emailAddress || '',
        phone: clerkData.user.primaryPhoneNumber?.phoneNumber || '',
        token: clerkData.user.id,
        role: clerkData.user.publicMetadata?.role || (clerkData.user.primaryEmailAddress?.emailAddress?.includes('admin') ? 'admin' : 'passenger'),
        isClerk: true
      }
    : localUser;

  const isLoading = clerkData ? !clerkData.isLoaded : localLoading;

  return (
    <AuthContext.Provider value={{ user: activeUser, login, logout, loading: isLoading, isClerkActive: !!clerkData?.isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
