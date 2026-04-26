// User Profile Interface
export type UserPlan = 'free' | 'pro' | 'enterprise' | 'lifetime';

export interface UserUsage {
  leads: number;
  case_studies: number;
}

export interface UserProfile {
  uid: string;
  
  // Basic Info
  email: string;
  fullName: string;
  username?: string;
  specialty?: string; // User's freelancing specialty
  company?: string;
  bio?: string;
  photoURL?: string;
  status?: string;
  
  // Portfolio
  portfolio?: string;

  // Billing and Usage
  current_plan?: UserPlan;
  current_usage?: UserUsage;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  companyName: string;
  industry: string;
  projectType: string;
  year: number;
}
