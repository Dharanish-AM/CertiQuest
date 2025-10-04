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
  reviewList?: Review[];
  imageUrl?: string;
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface Review {
  id: string;
  userName: string;
  userId?: string;
  rating: number; // 1-5
  text: string;
  createdAt: string; // ISO
}
