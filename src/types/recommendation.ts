/**
 * Type definitions for the real-time recommendation system
 */

export interface User {
  id: string;
  name: string;
  preferences: string[];  // Categories user likes
  age?: number;
  joinedAt: Date;
  friends: string[];  // User IDs of friends
}

export interface Item {
  id: string;
  title: string;
  category: string;
  genre: string[];
  rating: number;
  description: string;
  imageUrl?: string;
  releaseYear?: number;
  popularity: number;  // Trending score
  language?: string;  // Item language (Telugu, Hindi, etc.)
}

export interface Interaction {
  userId: string;
  itemId: string;
  type: 'view' | 'like' | 'dislike' | 'purchase' | 'share';
  timestamp: Date;
  duration?: number;  // For view interactions
  rating?: number;    // For explicit ratings
}

export interface Recommendation {
  itemId: string;
  score: number;
  reason: string;  // Why this was recommended
  algorithm: 'collaborative' | 'content-based' | 'trending' | 'new-user';
}

export interface UserSession {
  userId: string;
  startTime: Date;
  interactions: Interaction[];
  isActive: boolean;
}

export interface RecommendationEngine {
  getRecommendations(userId: string, limit?: number): Recommendation[];
  updateUserInteraction(interaction: Interaction): void;
  getPopularItems(category?: string): Item[];
  getSimilarUsers(userId: string): string[];
}

export interface SystemMetrics {
  totalUsers: number;
  totalItems: number;
  totalInteractions: number;
  activeUsers: number;
  averageRating: number;
  topCategories: Array<{ category: string; count: number }>;
}