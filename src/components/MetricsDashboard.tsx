/**
 * Real-time metrics dashboard showing system statistics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Film, 
  Activity, 
  TrendingUp, 
  Star,
  Eye,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { SystemMetrics, Interaction } from '@/types/recommendation';

interface MetricsDashboardProps {
  metrics: SystemMetrics;
  recentInteractions: Interaction[];
  className?: string;
}

export function MetricsDashboard({ metrics, recentInteractions, className }: MetricsDashboardProps) {
  // Calculate interaction type distribution
  const interactionCounts = recentInteractions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRecentInteractions = recentInteractions.length;

  const interactionTypeIcons = {
    view: <Eye className="h-4 w-4" />,
    like: <Heart className="h-4 w-4" />,
    purchase: <ShoppingCart className="h-4 w-4" />,
    share: <TrendingUp className="h-4 w-4" />,
    dislike: <Star className="h-4 w-4" />
  };

  return (
    <div className={className}>
      {/* Main metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="rec-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rec-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-accent/20">
                <Film className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalItems}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rec-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-rec-trending/20">
                <Activity className="h-5 w-5 text-rec-trending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.totalInteractions}</p>
                <p className="text-xs text-muted-foreground">Interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rec-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-rec-hot/20">
                <TrendingUp className="h-5 w-5 text-rec-hot" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card className="rec-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Popular Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.topCategories.slice(0, 4).map((category, index) => {
              const percentage = (category.count / metrics.totalItems) * 100;
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">{category.count}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rec-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Real-time Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last {totalRecentInteractions} interactions
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(interactionCounts).map(([type, count]) => {
              const percentage = (count / totalRecentInteractions) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {interactionTypeIcons[type as keyof typeof interactionTypeIcons]}
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      <Card className="rec-card mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-rec-new">
                {metrics.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">User Engagement</p>
            </div>
            <div className="space-y-1 lg:col-span-1 col-span-2">
              <p className="text-2xl font-bold text-accent">
                {(metrics.totalInteractions / metrics.totalUsers).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Interactions per User</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}