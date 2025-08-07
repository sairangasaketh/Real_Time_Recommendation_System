/**
 * Item card component for displaying movies/shows in the recommendation system
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Share2, ShoppingCart, Star } from 'lucide-react';
import { Item, Interaction } from '@/types/recommendation';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
  isRecommended?: boolean;
  recommendationReason?: string;
  algorithm?: string;
  onInteract: (interaction: Omit<Interaction, 'userId' | 'timestamp'>) => void;
  className?: string;
}

export function ItemCard({ 
  item, 
  isRecommended = false, 
  recommendationReason, 
  algorithm,
  onInteract, 
  className 
}: ItemCardProps) {
  const handleInteraction = (type: Interaction['type']) => {
    onInteract({
      itemId: item.id,
      type,
      duration: type === 'view' ? Math.floor(Math.random() * 120) + 5 : undefined,
      rating: type === 'like' ? 4 + Math.random() : type === 'dislike' ? 1 + Math.random() : undefined,
    });
  };

  const getAlgorithmBadge = () => {
    if (!algorithm) return null;
    
    const badgeProps = {
      collaborative: { className: 'rec-badge-liked', label: 'Similar Users' },
      'content-based': { className: 'rec-badge-new', label: 'Your Taste' },
      trending: { className: 'rec-badge-trending', label: 'Trending' },
      'new-user': { className: 'rec-badge-hot', label: 'Popular' },
    }[algorithm] || { className: 'rec-badge-hot', label: algorithm };

    return (
      <Badge className={cn('text-xs font-medium', badgeProps.className)}>
        {badgeProps.label}
      </Badge>
    );
  };

  return (
    <Card className={cn(
      'rec-card group relative overflow-hidden border-border/50',
      isRecommended && 'animate-pulse-glow',
      className
    )}>
      {/* Background gradient for recommended items */}
      {isRecommended && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-gradient" />
      )}
      
      <CardHeader className="relative space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          {getAlgorithmBadge()}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
          {item.releaseYear && (
            <span>{item.releaseYear}</span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {item.genre.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.description}
        </p>

        {isRecommended && recommendationReason && (
          <div className="rounded-md bg-primary/10 p-2 border border-primary/20">
            <p className="text-xs text-primary font-medium">
              💡 {recommendationReason}
            </p>
          </div>
        )}

        {/* Interaction buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleInteraction('view')}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Watch
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleInteraction('like')}
            className="text-rec-liked hover:text-rec-liked hover:bg-rec-liked/10"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleInteraction('share')}
            className="text-accent hover:text-accent hover:bg-accent/10"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleInteraction('purchase')}
            className="text-rec-trending hover:text-rec-trending hover:bg-rec-trending/10"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}