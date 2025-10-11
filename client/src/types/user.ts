export interface UserProfile {
  name: string,
  createdAt: string;
  id: string;
  email: string;
  password: string;
  role: 'Student' | 'Faculty' | 'Admin';
  fullName: string;
  avatar?: string;
  bookmarks: string[];
  // Student-specific fields
  university?: string;
  degree?: string;
  graduationYear?: number;
  interests?: string[];
  // Faculty-specific fields
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
}
