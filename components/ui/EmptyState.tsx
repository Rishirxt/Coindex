import React from 'react';
import { Search, Info, AlertTriangle, Star } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'no-watchlist' | 'no-results' | 'fetch-failed';
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const EmptyState = ({ type, title, description, onRetry, className }: EmptyStateProps) => {
  const config = {
    'no-watchlist': {
      icon: <Star className="h-12 w-12 text-yellow-400/50" />,
      defaultTitle: 'Your watchlist is empty',
      defaultDescription: 'Start adding coins to your watchlist to track them here.',
    },
    'no-results': {
      icon: <Search className="h-12 w-12 text-purple-100/30" />,
      defaultTitle: 'No results found',
      defaultDescription: 'We couldn\'t find any coins matching your search.',
    },
    'fetch-failed': {
      icon: <AlertTriangle className="h-12 w-12 text-red-500/50" />,
      defaultTitle: 'Failed to fetch data',
      defaultDescription: 'There was an error connecting to the crypto market. Please try again.',
    },
  };

  const { icon, defaultTitle, defaultDescription } = config[type];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center bg-dark-400/20 rounded-xl border border-purple-100/5",
      className
    )}>
      <div className="mb-4 p-4 bg-dark-400 rounded-full border border-purple-100/10 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-text-muted max-w-xs mb-6">
        {description || defaultDescription}
      </p>
      {type === 'fetch-failed' && onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2 border-purple-500/30 hover:bg-purple-500/10">
          <Info size={16} />
          Retry Now
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
