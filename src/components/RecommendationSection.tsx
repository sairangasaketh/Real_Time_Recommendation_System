/**
 * Section component for displaying different types of recommendations
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from './ItemCard';
import { Sparkles, TrendingUp, Users, Star } from 'lucide-react';
import { Item, Recommendation, Interaction } from '@/types/recommendation';

interface RecommendationSectionProps {
  title: string;
  recommendations: Recommendation[];
  items: Map<string, Item>;
  onInteract: (interaction: Omit<Interaction, 'userId' | 'timestamp'>) => void;
  type?: 'personalized' | 'trending' | 'popular' | 'similar';
  className?: string;
}

export function RecommendationSection({ 
  title, 
  recommendations, 
  items, 
  onInteract, 
  type = 'personalized',
  className 
}: RecommendationSectionProps) {
  const getIcon = () => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-rec-trending" />;
      case 'popular':
        return <Star className="h-5 w-5 text-rec-hot" />;
      case 'similar':
        return <Users className="h-5 w-5 text-rec-liked" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'trending':
        return 'rec-badge-trending';
      case 'popular':
        return 'rec-badge-hot';
      case 'similar':
        return 'rec-badge-liked';
      default:
        return 'rec-badge-new';
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card className={`rec-card ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getIcon()}
            {title}
            <Badge className={getBadgeColor()}>0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recommendations available yet.</p>
            <p className="text-sm">Interact with more items to get personalized suggestions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rec-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          {title}
          <Badge className={getBadgeColor()}>
            {recommendations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {recommendations.map((recommendation, index) => {
              const item = items.get(recommendation.itemId);
              if (!item) return null;

              return (
                <div key={recommendation.itemId} className="flex-none w-80">
                  <ItemCard
                    item={item}
                    isRecommended={true}
                    recommendationReason={recommendation.reason}
                    algorithm={recommendation.algorithm}
                    onInteract={onInteract}
                    className={index === 0 ? 'border-primary/50' : ''}
                  />
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}