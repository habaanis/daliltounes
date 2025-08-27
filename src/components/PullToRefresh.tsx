import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolledToTop = true;

    const handleScroll = () => {
      isScrolledToTop = container.scrollTop === 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isScrolledToTop || isRefreshing) return;
      
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || !isScrolledToTop || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0) {
        e.preventDefault();
        const distance = Math.min(diff * 0.5, MAX_PULL);
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;

      setIsPulling(false);

      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setPullDistance(0);
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  const refreshOpacity = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const refreshRotation = (pullDistance / PULL_THRESHOLD) * 360;

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      {/* Indicateur de pull-to-refresh */}
      <div 
        className="flex items-center justify-center py-4 transition-all duration-200"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: refreshOpacity
        }}
      >
        <div className="bg-white rounded-full p-3 shadow-lg">
          <RefreshCw 
            className={`h-6 w-6 text-blue-600 transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${refreshRotation}deg)`
            }}
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div 
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;