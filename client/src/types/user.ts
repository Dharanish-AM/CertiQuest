export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  // Student specific
  university?: string;
  degree?: string;
  graduationYear?: number;
  interests?: string[];
  // Faculty specific
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
  // Admin specific
  adminLevel?: 'super' | 'moderator';
  joinedDate?: string;
}
