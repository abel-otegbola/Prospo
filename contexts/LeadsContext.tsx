'use client'
import { type ReactNode, useEffect, useState, useContext } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import { FirebaseError } from "firebase/app";
import { app } from "../firebase/firebase";
import { AuthContext } from "./AuthContextValue";
import { LeadsContext, type Lead } from "./LeadsContextValue";
import { assertUserWithinPlanLimit, incrementUserUsage } from "../helpers/profileUsage";

const db = getFirestore(app);

const LeadsProvider = ({ children }: { children: ReactNode }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    // Fetch leads for the current user
    const refreshLeads = async () => {
        if (!user?.uid) {
            setLeads([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadsRef = collection(db, 'leads');
            const q = query(leadsRef, where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);

            const fetchedLeads: Lead[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedLeads.push({
                    id: doc.id,
                    name: data.name,
                    company: data.company,
                    email: data.email,
                    phone: data.phone,
                    location: data.location,
                    status: data.status,
                    value: data.value,
                    industry: data.industry,
                    score: data.score,
                    addedDate: data.addedDate?.toDate?.()?.toISOString() || data.addedDate,
                    companyWebsite: data.companyWebsite,
                    websiteAudit: data.websiteAudit,
                    serviceNeeds: data.serviceNeeds || [],
                    userId: data.userId,
                    linkedinUrl: data.linkedinUrl,
                    twitterUrl: data.twitterUrl,
                    facebookUrl: data.facebookUrl,
                    logoUrl: data.logoUrl,
                    foundedYear: data.foundedYear,
                    estimatedEmployees: data.estimatedEmployees,
                    notes: data.notes,
                    about: data.about,
                });
            });
            console.log(fetchedLeads)
            setLeads(fetchedLeads);
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add a new lead
    const addLead = async (leadData: Omit<Lead, 'id' | 'addedDate'>) => {
        setLoading(true);
        setError(null);

        try {
            await assertUserWithinPlanLimit(leadData.userId, 'leads');

            const leadsRef = collection(db, 'leads');
            const newLead = {
                ...leadData,
                addedDate: Timestamp.now()
            };

            console.log('📤 Calling Firebase addDoc with data:', newLead);
            const docRef = await addDoc(leadsRef, newLead);
            console.log('✅ Firebase addDoc successful, doc ID:', docRef.id);

            try {
                await incrementUserUsage(leadData.userId, 'leads');
            } catch (usageError) {
                console.error('Failed to update lead usage counter:', usageError);
            }

            // Add to local state
            const addedLead: Lead = {
                ...leadData,
                id: docRef.id,
                addedDate: new Date().toISOString(),
                about: leadData.about,
            };

            setLeads(prev => {
                console.log('📝 Updating local state, current count:', prev.length);
                return [...prev, addedLead];
            });
            console.log('✅ Lead added successfully to local state');
            
            return docRef.id;
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('❌ Error adding lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing lead
    const updateLead = async (id: string, updates: Partial<Lead>) => {
        if (!user?.uid) {
            setError('User must be logged in to update leads');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadRef = doc(db, 'leads', id);
            await updateDoc(leadRef, updates);

            // Update local state
            setLeads(prev => 
                prev.map(lead => 
                    lead.id === id ? { ...lead, ...updates } : lead
                )
            );
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error updating lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a lead
    const deleteLead = async (id: string) => {
        if (!user?.uid) {
            setError('User must be logged in to delete leads');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadRef = doc(db, 'leads', id);
            await deleteDoc(leadRef);

            // Remove from local state
            setLeads(prev => prev.filter(lead => lead.id !== id));
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error deleting lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Audit a website for a lead
    const auditWebsite = async (leadId: string, websiteUrl: string) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 Starting website audit for:', websiteUrl);
            
            // Call the audit API
            const response = await fetch('/api/audit/website', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: websiteUrl })
            });

            const data = await response.json();
            
            if (data.success && data.audit) {
                console.log('✅ Audit completed:', data.audit);
                
                // Update the lead with audit data
                await updateLead(leadId, {
                    websiteAudit: data.audit
                });
                
                console.log('✅ Lead updated with audit data');
            } else {
                throw new Error(data.error || 'Audit failed');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
            console.error('❌ Error auditing website:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get a single lead by id (fresh from Firestore)
    const getSingleLead = async (id: string) => {
        try {
            const leadRef = doc(db, 'leads', id);
            const snap = await getDoc(leadRef);
            if (!snap.exists()) return null;
            const data = snap.data();
            const lead: Lead = {
                id: snap.id,
                name: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone,
                location: data.location,
                status: data.status,
                value: data.value,
                industry: data.industry,
                score: data.score,
                addedDate: data.addedDate?.toDate?.()?.toISOString() || data.addedDate,
                companyWebsite: data.companyWebsite,
                websiteAudit: data.websiteAudit,
                serviceNeeds: data.serviceNeeds || [],
                userId: data.userId,
                linkedinUrl: data.linkedinUrl,
                twitterUrl: data.twitterUrl,
                facebookUrl: data.facebookUrl,
                companyLinkedin: data.companyLinkedin,
                logoUrl: data.logoUrl,
                foundedYear: data.foundedYear,
                estimatedEmployees: data.estimatedEmployees,
                notes: data.notes,
                about: data.about,
            };

            return lead;
        } catch (err: unknown) {
            console.error('Error fetching single lead:', err);
            return null;
        }
    };

    // Fetch leads when user changes
    useEffect(() => {
        if (user?.uid) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            refreshLeads();
        } else {
            setLeads([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid]);

    return (
        <LeadsContext.Provider value={{ 
            leads, 
            loading, 
            error, 
            addLead, 
            updateLead, 
            deleteLead, 
            refreshLeads,
            auditWebsite,
            getSingleLead
        }}>
            {children}
        </LeadsContext.Provider>
    );
}

export default LeadsProvider;
