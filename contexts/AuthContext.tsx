'use client'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset, updateEmail, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { type ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from "../customHooks/useLocaStorage";
import { app, db } from "../firebase/firebase";
import { doc, setDoc, Timestamp, updateDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import type { UserPlan, UserUsage } from "../interface/userProfile";

import { AuthContext } from "./AuthContextValue";
import Toast from "../components/toast/Toast";

const auth = getAuth(app)

const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [popup, setPopup] = useState<{ type: string; msg: string; timestamp?: number }>({ type: "", msg: "" });
    const [loading, setLoading] = useState(false);
    const [, setResetEmail] = useState<string>("");
    const [resetCode, setResetCode] = useState<string>("");
    const router = useRouter()

    const formatError = (msg: string) => {
        const cleaned = msg
            .replace(/^Firebase: Error \(/i, '') // remove prefix
            .replace(/\).*$/, '') // remove trailing ')' and anything after
            .replace(/^auth\//, ''); // remove auth/ namespace if present

        return cleaned.replace(/-/g, ' ').trim();
    }

    const login = async (email: string, password: string, _rememberMe?: boolean, callbackUrl?: string) => {
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            
            // Set cookie for middleware authentication
            await fetch('/api/auth/set-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: res.user.uid, email: res.user.email }),
            });
            
            setPopup({ type: "success", msg: "Login Successful", timestamp: Date.now() });
            router.push(callbackUrl ? callbackUrl : "/account");
        } catch (error: unknown) {
            // Prefer FirebaseError when available, otherwise fall back to stringifying the error
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (data: { email: string, password: string, fullname: string, specialty?: string }) => {
        setLoading(true);
        try {
            // Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const firebaseUser = userCredential.user;
            
            // Create user profile in Firestore with all fields initialized
            const userProfile = {
                uid: firebaseUser.uid,
                email: data.email,
                fullName: data.fullname,
                specialty: data.specialty || '',
                username: '',
                company: '',
                bio: '',
                photoURL: firebaseUser.photoURL || '',
                status: 'available',
                portfolio: '',
                current_plan: 'free' as UserPlan,
                current_usage: {
                    leads: 0,
                    case_studies: 0,
                } as UserUsage,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };
            
            await setDoc(doc(db, 'userProfiles', firebaseUser.uid), userProfile);
            
            setUser(firebaseUser);
            setPopup({ type: "success", msg: "Signup Successful, Please login to continue", timestamp: Date.now() });
            router.push("/login");
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }
    
    const sociallogin = async (callbackUrl?: string) => {
        setLoading(true)
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            const firebaseUser = userCredential.user;
            setUser(firebaseUser);
            
            // Set cookie for middleware authentication
            await fetch('/api/auth/set-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }),
            });
            
            setPopup({ type: "success", msg: "Login Successful", timestamp: Date.now() });
            setLoading(false);
            router.push(callbackUrl ? callbackUrl : "/account");
        } catch (error: unknown) {
            // Prefer FirebaseError when available, otherwise fall back to stringifying the error
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
            setLoading(false);
        }
    }

    const logOut = async () => {
        try {
            // Clear cookie
            await fetch('/api/auth/clear-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            await signOut(auth);
            setUser(null);
            setPopup({ type: "success", msg:  "Logout Successful", timestamp: Date.now() });
            router.push('/login');
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() })
        }
    }

    const forgotPassword = async (email: string) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmail(email);
            setPopup({ type: "success", msg: "Password reset code sent to your email", timestamp: Date.now() });
            router.push("/verify-otp");
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async (otp: string) => {
        setLoading(true);
        try {
            await verifyPasswordResetCode(auth, otp);
            setResetCode(otp);
            setPopup({ type: "success", msg: "OTP verified successfully", timestamp: Date.now() });
            router.push("/reset-password");
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async (password: string) => {
        setLoading(true);
        try {
            await confirmPasswordReset(auth, resetCode, password);
            setResetEmail("");
            setResetCode("");
            setPopup({ type: "success", msg: "Password reset successfully. Please login", timestamp: Date.now() });
            router.push("/login");
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }

    const updateUser = async (data: { email?: string, password?: string, fullname?: string, specialty?: string, bio?: string, photoURL?: string, username?: string, status?: string, current_plan?: UserPlan, current_usage?: UserUsage }) => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error('No user is currently logged in');
            }

            // Update Firebase Auth profile
            const authUpdates: { displayName?: string; photoURL?: string } = {};
            if (data.fullname) authUpdates.displayName = data.fullname;
            if (data.photoURL !== undefined) authUpdates.photoURL = data.photoURL;
            
            if (Object.keys(authUpdates).length > 0) {
                await updateProfile(currentUser, authUpdates);
            }

            if (data.email && data.email !== currentUser.email) {
                await updateEmail(currentUser, data.email);
            }

            if (data.password) {
                await updatePassword(currentUser, data.password);
            }

            // Update Firestore user profile
            const userProfileRef = doc(db, 'userProfiles', currentUser.uid);
            const userProfileDoc = await getDoc(userProfileRef);
            
            if (userProfileDoc.exists()) {
                const updates: Record<string, unknown> = {
                    updatedAt: Timestamp.now()
                };
                
                if (data.fullname) updates.fullName = data.fullname;
                if (data.email) updates.email = data.email;
                if (data.specialty) updates.specialty = data.specialty;
                if (data.bio !== undefined) updates.bio = data.bio;
                if (data.photoURL !== undefined) updates.photoURL = data.photoURL;
                if (data.username) updates.username = data.username;
                if (data.status) updates.status = data.status;
                if (data.current_plan) updates.current_plan = data.current_plan;
                if (data.current_usage) updates.current_usage = data.current_usage;
                
                await updateDoc(userProfileRef, updates);
            }

            // Refresh the user state
            setUser({ ...currentUser });
            
            setPopup({ type: "success", msg: "Profile updated successfully", timestamp: Date.now() });
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deleteAccount = async (password: string) => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) throw new Error('No user is currently logged in');

            // Re-authenticate before deletion
            const credential = EmailAuthProvider.credential(currentUser.email, password);
            await reauthenticateWithCredential(currentUser, credential);

            // Delete Firestore leads
            const leadsQuery = query(collection(db, 'leads'), where('userId', '==', currentUser.uid));
            const leadsSnap = await getDocs(leadsQuery);
            await Promise.all(leadsSnap.docs.map(d => deleteDoc(d.ref)));

            // Delete Firestore profile
            await deleteDoc(doc(db, 'userProfiles', currentUser.uid));

            // Delete Firebase Auth account
            await deleteUser(currentUser);

            setUser(null);
            setPopup({ type: 'success', msg: 'Account deleted successfully', timestamp: Date.now() });
        } catch (error: unknown) {
            const message = String(error);
            setPopup({ type: 'error', msg: formatError(message), timestamp: Date.now() });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
    }, [setUser]);

    return (
        <AuthContext.Provider value={{ user, loading, popup, login, signUp, sociallogin, logOut, forgotPassword, verifyOtp, resetPassword, updateUser, deleteAccount }}>
            <Toast
              message={popup?.msg} 
              type={popup?.type as "error" | "success"} 
              timestamp={popup?.timestamp}
            />
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
