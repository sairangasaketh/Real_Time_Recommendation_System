/**
 * Main dashboard component for the real-time recommendation system
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserSelector } from './UserSelector';
import { MetricsDashboard } from './MetricsDashboard';
import { RecommendationSection } from './RecommendationSection';
import { ItemCard } from './ItemCard';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { 
  User, 
  Item, 
  Interaction, 
  SystemMetrics,
  Recommendation 
} from '@/types/recommendation';
import { generateMockUsers, generateMockItems, generateMockInteractions } from '@/lib/mockData';
import { RealtimeRecommendationEngine } from '@/lib/recommendationEngine';

export function RecommendationDashboard() {
  const { toast } = useToast();

  // Initialize data
  const [users] = useState<User[]>(() => generateMockUsers(16));
  const [items] = useState<Item[]>(() => generateMockItems(50));
  const [interactions, setInteractions] = useState<Interaction[]>(() => 
    generateMockInteractions(generateMockUsers(16), generateMockItems(50), 200)
  );

  // Simulation state
  const [activeUserId, setActiveUserId] = useState<string>('user_1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(2000); // ms between interactions

  // Create recommendation engine
  const engine = useMemo(() => 
    new RealtimeRecommendationEngine(users, items, interactions), 
    [users, items, interactions]
  );

  // Create maps for quick lookup
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  const itemMap = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);

  // Calculate metrics
  const metrics = useMemo((): SystemMetrics => {
    const recentInteractions = interactions.filter(
      i => Date.now() - i.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    const activeUserIds = new Set(recentInteractions.map(i => i.userId));
    const categoryCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: users.length,
      totalItems: items.length,
      totalInteractions: interactions.length,
      activeUsers: activeUserIds.size,
      averageRating: items.reduce((sum, item) => sum + item.rating, 0) / items.length,
      topCategories: Object.entries(categoryCounts).map(([category, count]) => ({ 
        category, 
        count: Number(count) 
      })).sort((a, b) => b.count - a.count)
    };
  }, [users.length, items, interactions]);

  // Get recommendations for active user
  const recommendations = useMemo(() => {
    if (!activeUserId) return [];
    return engine.getRecommendations(activeUserId, 10);
  }, [engine, activeUserId, interactions]); // Re-calculate when interactions change

  // Get similar users
  const similarUsers = useMemo(() => {
    if (!activeUserId) return [];
    return engine.getSimilarUsers(activeUserId, 5);
  }, [engine, activeUserId, interactions]);

  // Get trending items
  const trendingItems = useMemo(() => {
    return engine.getPopularItems().slice(0, 8);
  }, [engine, interactions]);

  // Handle user interaction
  const handleInteraction = (interactionData: Omit<Interaction, 'userId' | 'timestamp'>) => {
    if (!activeUserId) return;

    const newInteraction: Interaction = {
      ...interactionData,
      userId: activeUserId,
      timestamp: new Date(),
    };

    setInteractions(prev => [newInteraction, ...prev]);
    engine.updateUserInteraction(newInteraction);

    // Show toast notification
    const item = itemMap.get(interactionData.itemId);
    if (item) {
      const user = userMap.get(activeUserId);
      toast({
        title: `${interactionData.type.charAt(0).toUpperCase() + interactionData.type.slice(1)}ed!`,
        description: `${user?.name} ${interactionData.type}ed "${item.title}"`,
        duration: 2000,
      });
    }
  };

  // Auto-simulation of user behavior
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random user and item for simulation
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const randomType: Interaction['type'] = ['view', 'like', 'dislike', 'purchase', 'share'][
        Math.floor(Math.random() * 5)
      ] as Interaction['type'];

      const simulatedInteraction: Interaction = {
        userId: randomUser.id,
        itemId: randomItem.id,
        type: randomType,
        timestamp: new Date(),
        duration: randomType === 'view' ? Math.floor(Math.random() * 120) + 5 : undefined,
        rating: ['like', 'dislike'].includes(randomType) ? (randomType === 'like' ? 4 + Math.random() : 1 + Math.random()) : undefined,
      };

      setInteractions(prev => [simulatedInteraction, ...prev.slice(0, 999)]); // Keep last 1000
      engine.updateUserInteraction(simulatedInteraction);
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, users, items, engine]);

  // Group recommendations by algorithm
  const groupedRecommendations = useMemo(() => {
    const groups = recommendations.reduce((acc, rec) => {
      const key = rec.algorithm;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    }, {} as Record<string, Recommendation[]>);

    return groups;
  }, [recommendations]);

  const activeUser = userMap.get(activeUserId);
  const recentInteractions = interactions.slice(0, 50); // Last 50 interactions

  return (
    <div className="bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
            Real-time Recommender System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced collaborative filtering with real-time updates. Watch recommendations evolve as users interact with content.
          </p>
        </div>

        {/* Simulation Controls */}
        <Card className="rec-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSimulating ? 'Stop' : 'Start'} Simulation
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              {[1000, 2000, 3000].map(speed => (
                <Button
                  key={speed}
                  variant={simulationSpeed === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSimulationSpeed(speed)}
                >
                  {speed === 1000 ? 'Fast' : speed === 2000 ? 'Normal' : 'Slow'}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            {isSimulating && (
              <Badge className="rec-badge-hot animate-pulse">
                Live Simulation Active
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Column - User & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <UserSelector
              users={users}
              activeUser={activeUser || null}
              onUserChange={setActiveUserId}
            />

            {/* Similar Users */}
            {similarUsers.length > 0 && (
              <Card className="rec-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Similar Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {similarUsers.map(userId => {
                    const user = userMap.get(userId);
                    return user ? (
                      <div key={userId} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    ) : null;
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Metrics Dashboard */}
            <MetricsDashboard 
              metrics={metrics} 
              recentInteractions={recentInteractions}
            />

            <Separator />

            {/* Personalized Recommendations */}
            {Object.entries(groupedRecommendations).map(([algorithm, recs]) => (
              <RecommendationSection
                key={algorithm}
                title={`${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Recommendations`}
                recommendations={recs}
                items={itemMap}
                onInteract={handleInteraction}
                type={algorithm as any}
              />
            ))}

            {/* Trending Items */}
            <RecommendationSection
              title="Trending Now"
              recommendations={trendingItems.map(item => ({
                itemId: item.id,
                score: item.popularity / 100,
                reason: `Popular with ${Math.floor(item.popularity / 10)} recent interactions`,
                algorithm: 'trending' as const
              }))}
              items={itemMap}
              onInteract={handleInteraction}
              type="trending"
            />

            {/* All Items Browser */}
            <Card className="rec-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Browse All Content</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interact with any item to improve your recommendations
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.slice(0, 12).map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onInteract={handleInteraction}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}