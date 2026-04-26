'use client';
// User Profile Provider Implementation
import { useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { UserProfileContext } from './UserProfileContextValue';
import type { UserProfile } from '../interface/userProfile';
import { AuthContext } from './AuthContextValue';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

export default function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true);
      const profileDoc = await getDoc(doc(db, 'userProfiles', userId));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          ...data,
          current_plan: data.current_plan || 'free',
          current_usage: data.current_usage || { leads: 0, case_studies: 0 },
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };
  
    // Load user profile when user changes
  useEffect(() => {
    if (!user?.uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setLoading(false);
      return;
    }

    loadProfile(user.uid);
  }, [user?.uid]);

  const createProfile = async (profileData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const newProfile: UserProfile = {
        ...profileData,
        uid: user.uid,
        current_plan: profileData.current_plan || 'free',
        current_usage: profileData.current_usage || { leads: 0, case_studies: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'userProfiles', user.uid), {
        ...newProfile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setProfile(newProfile);
      console.log('✅ Profile created successfully');
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      setProfile(prev => prev ? {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      } : null);

      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const profileDoc = await getDoc(doc(db, 'userProfiles', userId));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        return {
          ...data,
          current_plan: data.current_plan || 'free',
          current_usage: data.current_usage || { leads: 0, case_studies: 0 },
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        createProfile,
        updateProfile,
        getProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
