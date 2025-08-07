/**
 * Mock data generator for the recommendation system
 * Simulates a movie/streaming platform dataset
 */

import { User, Item, Interaction } from '@/types/recommendation';

const genres = [
  // International genres
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary',
  // Indian/Tollywood specific genres
  'Telugu Action', 'Masala', 'Mythological', 'Historical', 'Devotional',
  'Family Drama', 'Social Drama', 'Commercial', 'Art Film', 'Period Drama',
  'Folk Tale', 'Biographical', 'Musical', 'Dance', 'Regional Comedy'
];
const categories = ['Movies', 'TV Shows', 'Documentaries', 'Shorts', 'Regional Films', 'Web Series'];

const movieTitles = [
  // International titles
  'Galactic Warriors', 'Love in Paris', 'The Mystery Box', 'Robot Revolution',
  'Ocean Depths', 'Mountain Peak', 'City Lights', 'Forest Whispers',
  'Desert Storm', 'Arctic Adventure', 'Space Odyssey', 'Time Traveler',
  'Dream Catcher', 'Shadow Hunter', 'Light Bearer', 'Storm Chaser',
  // Indian/Telugu titles
  'Maha Baahubali', 'Raja Vikram', 'Super Arya', 'Mega Hero',
  'Veer Simha Reddy', 'Power Star', 'Mass Maharaja', 'Young Tiger',
  'Sri Rama Rajyam', 'Deva Krishna', 'Maharaja Returns', 'Legend Warrior',
  'Fire Dance', 'Ice Palace', 'Wind Runner', 'Earth Shaker',
  'Star Crossed', 'Moon Walker', 'Sun Chaser', 'Cloud Rider',
  'Wave Surfer', 'Snow Queen', 'Rain Maker', 'Thunder King'
];

const userNames = [
  // International names
  'Alex Chen', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson',
  'John Smith', 'Lisa Brown', 'David Lee', 'Anna Garcia',
  'Chris Miller', 'Maya Patel', 'Tom Anderson', 'Sofia Rodriguez',
  // Indian/Telugu names
  'Arjun Reddy', 'Priya Sharma', 'Ravi Kumar', 'Deepika Patel',
  'Suresh Babu', 'Kavya Nair', 'Vikram Singh', 'Anitha Rao',
  'Rajesh Gupta', 'Sujatha Devi', 'Mahesh Chandra', 'Lakshmi Devi'
];

/**
 * Generate mock users with realistic preferences
 */
export function generateMockUsers(count: number = 16): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `user_${i + 1}`,
    name: userNames[i % userNames.length],
    preferences: genres.slice(0, 2 + Math.floor(Math.random() * 3)), // 2-4 preferred genres
    age: 18 + Math.floor(Math.random() * 50),
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in past year
    friends: [], // Empty friends array initially
  }));
}

/**
 * Generate mock items (movies/shows) with realistic metadata
 */
export function generateMockItems(count: number = 50): Item[] {
  return Array.from({ length: count }, (_, i) => {
    const title = movieTitles[i % movieTitles.length];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const itemGenres = [genres[Math.floor(Math.random() * genres.length)]];
    
    // Sometimes add a second genre
    if (Math.random() > 0.5) {
      const secondGenre = genres[Math.floor(Math.random() * genres.length)];
      if (!itemGenres.includes(secondGenre)) {
        itemGenres.push(secondGenre);
      }
    }

    return {
      id: `item_${i + 1}`,
      title: `${title} ${i > movieTitles.length - 1 ? `(${Math.floor(i / movieTitles.length) + 1})` : ''}`,
      category,
      genre: itemGenres,
      rating: 1 + Math.random() * 4, // 1-5 rating
      description: `An amazing ${itemGenres.join('/')} ${category.toLowerCase().slice(0, -1)} that will keep you on the edge of your seat.`,
      releaseYear: 2015 + Math.floor(Math.random() * 9), // 2015-2023
      popularity: Math.random() * 100, // 0-100 popularity score
    };
  });
}

/**
 * Generate mock interactions based on user preferences
 */
export function generateMockInteractions(users: User[], items: Item[], count: number = 200): Interaction[] {
  const interactions: Interaction[] = [];
  const interactionTypes: Interaction['type'][] = ['view', 'like', 'dislike', 'purchase', 'share'];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    let item: Item;
    
    // 70% chance to pick item matching user preferences
    if (Math.random() < 0.7) {
      const preferredItems = items.filter(item => 
        item.genre.some(g => user.preferences.includes(g))
      );
      item = preferredItems.length > 0 
        ? preferredItems[Math.floor(Math.random() * preferredItems.length)]
        : items[Math.floor(Math.random() * items.length)];
    } else {
      item = items[Math.floor(Math.random() * items.length)];
    }
    
    const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
    
    interactions.push({
      userId: user.id,
      itemId: item.id,
      type,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      duration: type === 'view' ? Math.floor(Math.random() * 120) + 5 : undefined, // 5-125 minutes
      rating: ['like', 'dislike'].includes(type) ? (type === 'like' ? 4 + Math.random() : 1 + Math.random()) : undefined,
    });
  }
  
  return interactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get trending items based on recent interactions
 */
export function getTrendingItems(items: Item[], interactions: Interaction[]): Item[] {
  const recentInteractions = interactions.filter(
    i => Date.now() - i.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
  );
  
  const itemCounts = new Map<string, number>();
  recentInteractions.forEach(interaction => {
    const count = itemCounts.get(interaction.itemId) || 0;
    itemCounts.set(interaction.itemId, count + 1);
  });
  
  return items
    .map(item => ({
      ...item,
      popularity: (itemCounts.get(item.id) || 0) * 10 + item.popularity
    }))
    .sort((a, b) => b.popularity - a.popularity);
}