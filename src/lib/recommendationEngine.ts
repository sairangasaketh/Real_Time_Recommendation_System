/**
 * Real-time recommendation engine with collaborative filtering and content-based algorithms
 */

import { User, Item, Interaction, Recommendation, RecommendationEngine } from '@/types/recommendation';

export class RealtimeRecommendationEngine implements RecommendationEngine {
  private users: Map<string, User> = new Map();
  private items: Map<string, Item> = new Map();
  private interactions: Interaction[] = [];
  private userItemMatrix: Map<string, Map<string, number>> = new Map();

  constructor(users: User[], items: Item[], interactions: Interaction[]) {
    this.initializeData(users, items, interactions);
  }

  /**
   * Initialize the recommendation engine with data
   */
  private initializeData(users: User[], items: Item[], interactions: Interaction[]) {
    // Store users and items in maps for quick lookup
    users.forEach(user => this.users.set(user.id, user));
    items.forEach(item => this.items.set(item.id, item));
    
    // Process interactions to build user-item matrix
    this.interactions = [...interactions];
    this.rebuildUserItemMatrix();
  }

  /**
   * Rebuild the user-item interaction matrix
   */
  private rebuildUserItemMatrix() {
    this.userItemMatrix.clear();
    
    this.interactions.forEach(interaction => {
      if (!this.userItemMatrix.has(interaction.userId)) {
        this.userItemMatrix.set(interaction.userId, new Map());
      }
      
      const userItems = this.userItemMatrix.get(interaction.userId)!;
      const currentScore = userItems.get(interaction.itemId) || 0;
      
      // Weight different interaction types
      let scoreIncrement = 0;
      switch (interaction.type) {
        case 'view':
          scoreIncrement = 1;
          break;
        case 'like':
          scoreIncrement = 3;
          break;
        case 'purchase':
          scoreIncrement = 5;
          break;
        case 'share':
          scoreIncrement = 4;
          break;
        case 'dislike':
          scoreIncrement = -2;
          break;
      }
      
      userItems.set(interaction.itemId, currentScore + scoreIncrement);
    });
  }

  /**
   * Calculate cosine similarity between two users
   */
  private calculateUserSimilarity(userId1: string, userId2: string): number {
    const user1Items = this.userItemMatrix.get(userId1);
    const user2Items = this.userItemMatrix.get(userId2);
    
    if (!user1Items || !user2Items) return 0;
    
    // Find common items
    const commonItems = Array.from(user1Items.keys()).filter(itemId => 
      user2Items.has(itemId)
    );
    
    if (commonItems.length === 0) return 0;
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    commonItems.forEach(itemId => {
      const score1 = user1Items.get(itemId) || 0;
      const score2 = user2Items.get(itemId) || 0;
      
      dotProduct += score1 * score2;
      norm1 += score1 * score1;
      norm2 += score2 * score2;
    });
    
    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Get similar users for collaborative filtering
   */
  getSimilarUsers(userId: string, limit: number = 5): string[] {
    const similarities: Array<{ userId: string; similarity: number }> = [];
    
    for (const otherUserId of this.userItemMatrix.keys()) {
      if (otherUserId !== userId) {
        const similarity = this.calculateUserSimilarity(userId, otherUserId);
        if (similarity > 0) {
          similarities.push({ userId: otherUserId, similarity });
        }
      }
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => s.userId);
  }

  /**
   * Collaborative filtering recommendations
   */
  private getCollaborativeRecommendations(userId: string, limit: number): Recommendation[] {
    const similarUsers = this.getSimilarUsers(userId, 10);
    const userItems = this.userItemMatrix.get(userId) || new Map();
    const candidateItems = new Map<string, number>();
    
    // Aggregate scores from similar users
    similarUsers.forEach(similarUserId => {
      const similarity = this.calculateUserSimilarity(userId, similarUserId);
      const similarUserItems = this.userItemMatrix.get(similarUserId);
      
      if (similarUserItems) {
        similarUserItems.forEach((score, itemId) => {
          // Skip items the user has already interacted with
          if (!userItems.has(itemId) && score > 0) {
            const weightedScore = score * similarity;
            candidateItems.set(itemId, (candidateItems.get(itemId) || 0) + weightedScore);
          }
        });
      }
    });
    
    return Array.from(candidateItems.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([itemId, score]) => ({
        itemId,
        score: score / similarUsers.length, // Normalize score
        reason: `Users with similar taste also liked this`,
        algorithm: 'collaborative' as const
      }));
  }

  /**
   * Content-based recommendations
   */
  private getContentBasedRecommendations(userId: string, limit: number): Recommendation[] {
    const user = this.users.get(userId);
    const userItems = this.userItemMatrix.get(userId) || new Map();
    
    if (!user) return [];
    
    // Get user's preferred genres from interactions
    const genreScores = new Map<string, number>();
    userItems.forEach((score, itemId) => {
      const item = this.items.get(itemId);
      if (item && score > 0) {
        item.genre.forEach(genre => {
          genreScores.set(genre, (genreScores.get(genre) || 0) + score);
        });
      }
    });
    
    // Score all uninteracted items based on genre preference
    const candidateItems: Array<{ itemId: string; score: number }> = [];
    
    this.items.forEach((item, itemId) => {
      if (!userItems.has(itemId)) {
        let score = 0;
        item.genre.forEach(genre => {
          score += genreScores.get(genre) || 0;
        });
        
        // Boost score based on item rating and popularity
        score += item.rating * 0.5 + item.popularity * 0.1;
        
        if (score > 0) {
          candidateItems.push({ itemId, score });
        }
      }
    });
    
    return candidateItems
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ itemId, score }) => ({
        itemId,
        score: score / 10, // Normalize score
        reason: `Matches your preferences for ${Array.from(genreScores.keys()).slice(0, 2).join(' and ')}`,
        algorithm: 'content-based' as const
      }));
  }

  /**
   * Get trending/popular recommendations
   */
  private getTrendingRecommendations(userId: string, limit: number): Recommendation[] {
    const userItems = this.userItemMatrix.get(userId) || new Map();
    
    // Get recent interactions (last 7 days)
    const recentInteractions = this.interactions.filter(
      i => Date.now() - i.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    
    // Count interactions per item
    const itemCounts = new Map<string, number>();
    recentInteractions.forEach(interaction => {
      if (interaction.type !== 'dislike') {
        itemCounts.set(interaction.itemId, (itemCounts.get(interaction.itemId) || 0) + 1);
      }
    });
    
    return Array.from(itemCounts.entries())
      .filter(([itemId]) => !userItems.has(itemId)) // Exclude user's items
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([itemId, count]) => ({
        itemId,
        score: count / 10,
        reason: `Trending now - ${count} recent interactions`,
        algorithm: 'trending' as const
      }));
  }

  /**
   * Main recommendation method that combines different algorithms
   */
  getRecommendations(userId: string, limit: number = 10): Recommendation[] {
    const userInteractionCount = this.userItemMatrix.get(userId)?.size || 0;
    
    // For new users (cold start), prioritize content-based and trending
    if (userInteractionCount < 3) {
      const contentBased = this.getContentBasedRecommendations(userId, Math.ceil(limit * 0.6));
      const trending = this.getTrendingRecommendations(userId, Math.ceil(limit * 0.4));
      
      return [...contentBased, ...trending]
        .slice(0, limit)
        .map(rec => ({ ...rec, algorithm: 'new-user' as const }));
    }
    
    // For established users, combine collaborative and content-based
    const collaborative = this.getCollaborativeRecommendations(userId, Math.ceil(limit * 0.6));
    const contentBased = this.getContentBasedRecommendations(userId, Math.ceil(limit * 0.3));
    const trending = this.getTrendingRecommendations(userId, Math.ceil(limit * 0.1));
    
    // Combine and deduplicate
    const allRecommendations = [...collaborative, ...contentBased, ...trending];
    const uniqueRecommendations = new Map<string, Recommendation>();
    
    allRecommendations.forEach(rec => {
      if (!uniqueRecommendations.has(rec.itemId)) {
        uniqueRecommendations.set(rec.itemId, rec);
      }
    });
    
    return Array.from(uniqueRecommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Update the system with a new user interaction
   */
  updateUserInteraction(interaction: Interaction): void {
    this.interactions.unshift(interaction); // Add to beginning for recency
    
    // Keep only recent interactions to prevent memory bloat
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(0, 1000);
    }
    
    this.rebuildUserItemMatrix();
  }

  /**
   * Get popular items by category
   */
  getPopularItems(category?: string): Item[] {
    const itemPopularity = new Map<string, number>();
    
    // Calculate popularity based on recent interactions
    this.interactions
      .filter(i => Date.now() - i.timestamp.getTime() < 14 * 24 * 60 * 60 * 1000) // Last 2 weeks
      .forEach(interaction => {
        const current = itemPopularity.get(interaction.itemId) || 0;
        const weight = interaction.type === 'like' ? 3 : interaction.type === 'purchase' ? 5 : 1;
        itemPopularity.set(interaction.itemId, current + weight);
      });
    
    return Array.from(this.items.values())
      .filter(item => !category || item.category === category)
      .map(item => ({
        ...item,
        popularity: (itemPopularity.get(item.id) || 0) + item.popularity
      }))
      .sort((a, b) => b.popularity - a.popularity);
  }
}
