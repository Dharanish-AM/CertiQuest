export interface Certification {
  id: string;
  title: string;
  provider: string;
  domain: string;
  cost: number;
  deadline: string;
  description: string;
  credibility: 'verified' | 'trusted' | 'new';
  facultyVerified: boolean;
  bookmarked?: boolean;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
}

export type UserRole = 'student' | 'faculty' | 'admin';
