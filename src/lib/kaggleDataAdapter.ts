/**
 * Kaggle Amazon Product Reviews Dataset Adapter
 * Transforms CSV data into our recommendation system format
 */

import { User, Item, Interaction } from '@/types/recommendation';

export interface KaggleReview {
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  product_title: string;
  category: string;
  timestamp?: string;
  verified_purchase?: boolean;
}

/**
 * Transform Kaggle reviews to our Item format
 */
export function transformToItems(reviews: KaggleReview[]): Item[] {
  const itemMap = new Map<string, Item>();
  
  reviews.forEach(review => {
    if (!itemMap.has(review.product_id)) {
      // Extract genre from category and product title
      const genres = extractGenres(review.category, review.product_title);
      
      itemMap.set(review.product_id, {
        id: review.product_id,
        title: review.product_title,
        category: review.category,
        genre: genres,
        rating: review.rating,
        description: review.review_text.slice(0, 150) + '...',
        releaseYear: new Date().getFullYear(),
        popularity: Math.random() * 100,
        language: 'English' // Default, can be enhanced
      });
    }
  });
  
  return Array.from(itemMap.values());
}

/**
 * Transform Kaggle reviews to our User format
 */
export function transformToUsers(reviews: KaggleReview[]): User[] {
  const userMap = new Map<string, User>();
  
  reviews.forEach(review => {
    if (!userMap.has(review.user_id)) {
      // Infer preferences from user's highly rated items
      const userReviews = reviews.filter(r => r.user_id === review.user_id && r.rating >= 4);
      const preferences = [...new Set(userReviews.map(r => r.category))].slice(0, 3);
      
      userMap.set(review.user_id, {
        id: review.user_id,
        name: `User ${review.user_id.slice(-4)}`, // Anonymous naming
        preferences,
        age: 25 + Math.floor(Math.random() * 30),
        joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        friends: [] // Empty initially
      });
    }
  });
  
  return Array.from(userMap.values());
}

/**
 * Transform Kaggle reviews to our Interaction format
 */
export function transformToInteractions(reviews: KaggleReview[]): Interaction[] {
  return reviews.map(review => ({
    userId: review.user_id,
    itemId: review.product_id,
    type: review.rating >= 4 ? 'like' as const : review.rating <= 2 ? 'dislike' as const : 'view' as const,
    timestamp: review.timestamp ? new Date(review.timestamp) : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    rating: review.rating,
    duration: Math.floor(Math.random() * 60) + 5 // Simulated
  }));
}

/**
 * Extract genres from category and title
 */
function extractGenres(category: string, title: string): string[] {
  const genres: string[] = [];
  
  // Map categories to genres
  const categoryMap: Record<string, string[]> = {
    'Electronics': ['Tech', 'Gadgets'],
    'Books': ['Literature', 'Educational'],
    'Movies & TV': ['Entertainment', 'Drama'],
    'Music': ['Audio', 'Entertainment'],
    'Home & Kitchen': ['Lifestyle', 'Home'],
    'Clothing': ['Fashion', 'Apparel'],
    'Sports': ['Fitness', 'Recreation']
  };
  
  // Check category mapping
  Object.entries(categoryMap).forEach(([cat, genreList]) => {
    if (category.toLowerCase().includes(cat.toLowerCase())) {
      genres.push(...genreList);
    }
  });
  
  // Default genre if none found
  if (genres.length === 0) {
    genres.push('General');
  }
  
  return [...new Set(genres)].slice(0, 2);
}

/**
 * Load and parse CSV data (simulated - replace with actual CSV parser)
 */
export async function loadKaggleDataset(): Promise<{
  users: User[];
  items: Item[];
  interactions: Interaction[];
}> {
  // In real implementation, you would:
  // 1. Fetch CSV from public URL or local file
  // 2. Parse with Papa Parse or similar
  // 3. Transform using above functions
  
  // For now, return sample data structure
  console.log('Kaggle dataset adapter ready - replace with actual CSV loading logic');
  
  return {
    users: [],
    items: [],
    interactions: []
  };
}