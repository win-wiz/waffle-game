'use client';

import React, { memo, useMemo, useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  MessageCircle,
  Check,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareData {
  gameStatus: 'won' | 'lost';
  moveCount: number;
  maxMoves: number;
  rating?: {
    emoji: string;
    text: string;
    color: string;
  };
  totalGames?: number;
  winRate?: number;
  currentStreak?: number;
}

interface ShareDialogProps {
  trigger?: React.ReactNode;
  shareData: ShareData;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
}

// Share platform configurations
const SHARE_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-blue-500'
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-blue-600'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    textColor: 'text-blue-700'
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-green-500'
  },
  email: {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-500 hover:bg-gray-600',
    textColor: 'text-gray-500'
  },
  copy: {
    name: 'Copy Link',
    icon: Copy,
    color: 'bg-slate-500 hover:bg-slate-600',
    textColor: 'text-slate-500'
  }
} as const;

export const ShareDialog = memo(function ShareDialog({
  trigger,
  shareData,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  title = 'Share Your Result',
  description = 'Share your Waffle game achievement with friends!'
}: ShareDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  // Generate share text based on game result
  const shareText = useMemo(() => {
    const { gameStatus, moveCount, maxMoves, rating } = shareData;
    const isWin = gameStatus === 'won';
    const efficiency = Math.round(((maxMoves - moveCount) / maxMoves) * 100);

    let text = '';

    if (isWin) {
      text = `🎉 I just completed Waffle Game!\n\n`;
      text += `${rating?.emoji || '🎯'} Result: ${
        rating?.text || 'Completed'
      }\n`;
      text += `📊 Moves Used: ${moveCount}/${maxMoves}\n`;
      text += `⚡ Efficiency: ${efficiency}%\n\n`;
      text += `Can you beat my score? Play Waffle Game now!`;
    } else {
      text = `🎯 I gave Waffle Game a try!\n\n`;
      text += `💪 Used all ${maxMoves} moves but had fun!\n`;
      text += `🧩 This word puzzle game is challenging!\n\n`;
      text += `Think you can solve it? Try Waffle Game!`;
    }

    return text;
  }, [shareData]);

  // Generate detailed statistics text
  const statsText = useMemo(() => {
    const { totalGames, winRate, currentStreak } = shareData;
    if (!totalGames) return '';

    let text = `\n\n📈 My Waffle Stats:\n`;
    text += `🎮 Games Played: ${totalGames}\n`;
    text += `🏆 Win Rate: ${winRate?.toFixed(1) || 0}%\n`;
    text += `🔥 Current Streak: ${currentStreak || 0}`;

    return text;
  }, [shareData]);

  // Get current page URL
  const getCurrentUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://waffle-game.com'; // fallback URL
  }, []);

  // Copy text to clipboard with visual feedback
  const copyToClipboard = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success('Copied to clipboard!');

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  // Share handlers for different platforms
  const handleShare = useCallback(
    (platform: keyof typeof SHARE_PLATFORMS) => {
      const url = getCurrentUrl();
      const text = shareText + (platform === 'twitter' ? '' : statsText);
      const encodedText = encodeURIComponent(text);
      const encodedUrl = encodeURIComponent(url);

      let shareUrl = '';

      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
          break;
        case 'email':
          const subject = encodeURIComponent(
            'Check out my Waffle Game result!'
          );
          const body = encodeURIComponent(`${text}\n\nPlay here: ${url}`);
          shareUrl = `mailto:?subject=${subject}&body=${body}`;
          break;
        case 'copy':
          copyToClipboard(`${text}\n\nPlay here: ${url}`, 'link');
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    },
    [shareText, statsText, getCurrentUrl, copyToClipboard]
  );

  // Handle native share API if available
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Waffle Game Result',
          text: shareText,
          url: getCurrentUrl()
        });
      } catch (error) {
        // User cancelled the share or error occurred
        console.log('Share cancelled or failed:', error);
      }
    }
  }, [shareText, getCurrentUrl]);

  // Default trigger button
  const defaultTrigger = (
    <Button variant='outline' size='sm' className='gap-2'>
      <Share2 className='w-4 h-4' />
      Share
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>}

      <DialogContent className='max-w-lg bg-white border-0 shadow-2xl rounded-3xl p-0 overflow-hidden'>
        {/* Header with gradient background */}
        <div className='bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-6 text-white relative overflow-hidden'>
          <div className='absolute inset-0 bg-black/10'></div>
          <div className='relative z-10'>
            <DialogHeader className='text-center'>
              <div className='mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4'>
                <Share2 className='w-8 h-8 text-white' />
              </div>
              <DialogTitle className='text-2xl font-bold text-white mb-2'>
                {title}
              </DialogTitle>
              <DialogDescription className='text-blue-100'>
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Decorative elements */}
          <div className='absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full'></div>
          <div className='absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full'></div>
        </div>

        <div className='p-6 space-y-6'>
          {/* Result Preview Card */}
          <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                <Trophy className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1'>
                <div className='font-bold text-lg text-gray-900'>
                  {shareData.gameStatus === 'won'
                    ? 'Puzzle Completed!'
                    : 'Game Attempted!'}
                </div>
                <div className='text-gray-600'>
                  {shareData.moveCount}/{shareData.maxMoves} moves used
                </div>
              </div>
            </div>

            {shareData.rating && shareData.gameStatus === 'won' && (
              <div className='flex flex-wrap gap-2'>
                <Badge
                  variant='secondary'
                  className='bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 px-3 py-1'
                >
                  {shareData.rating.emoji} {shareData.rating.text}
                </Badge>
                <Badge
                  variant='outline'
                  className='bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 px-3 py-1'
                >
                  {Math.round(
                    ((shareData.maxMoves - shareData.moveCount) /
                      shareData.maxMoves) *
                      100
                  )}
                  % Efficiency
                </Badge>
              </div>
            )}
          </div>

          {/* Native Share Button (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <>
              <Button
                onClick={handleNativeShare}
                className='w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <Share2 className='w-5 h-5 mr-3' />
                Share via System
              </Button>
              <div className='relative my-6'>
                <Separator className='bg-gray-200' />
                <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500 font-medium'>
                  or choose platform
                </span>
              </div>
            </>
          )}

          {/* Platform Buttons Grid */}
          <div className='grid grid-cols-2 gap-3'>
            {Object.entries(SHARE_PLATFORMS)
              .slice(0, 4)
              .map(([key, platform]) => {
                const Icon = platform.icon;
                const isCopied = copiedStates[key];

                return (
                  <Button
                    key={key}
                    variant='outline'
                    className={`flex flex-col items-center gap-3 p-4 h-20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl border-2 ${
                      isCopied
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      handleShare(key as keyof typeof SHARE_PLATFORMS)
                    }
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isCopied ? 'bg-green-100' : platform.color
                      } text-white`}
                    >
                      {isCopied && key === 'copy' ? (
                        <Check className='w-4 h-4' />
                      ) : (
                        <Icon className='w-4 h-4' />
                      )}
                    </div>
                    <span className='text-xs font-medium'>
                      {isCopied && key === 'copy' ? 'Copied!' : platform.name}
                    </span>
                  </Button>
                );
              })}
          </div>

          {/* Additional Platforms */}
          <div className='grid grid-cols-2 gap-3'>
            {Object.entries(SHARE_PLATFORMS)
              .slice(4)
              .map(([key, platform]) => {
                const Icon = platform.icon;
                const isCopied = copiedStates[key];

                return (
                  <Button
                    key={key}
                    variant='outline'
                    className={`flex flex-col items-center gap-3 p-4 h-20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl border-2 ${
                      isCopied
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      handleShare(key as keyof typeof SHARE_PLATFORMS)
                    }
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isCopied ? 'bg-green-100' : platform.color
                      } text-white`}
                    >
                      {isCopied && key === 'copy' ? (
                        <Check className='w-4 h-4' />
                      ) : (
                        <Icon className='w-4 h-4' />
                      )}
                    </div>
                    <span className='text-xs font-medium'>
                      {isCopied && key === 'copy' ? 'Copied!' : platform.name}
                    </span>
                  </Button>
                );
              })}
          </div>

          {/* Quick Copy Button */}
          <div className='pt-4 border-t border-gray-100'>
            <Button
              variant='ghost'
              className='w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-3 rounded-xl font-medium'
              onClick={() => copyToClipboard(shareText + statsText, 'text')}
            >
              {copiedStates.text ? (
                <>
                  <Check className='w-4 h-4 mr-2 text-green-600' />
                  <span className='text-green-600'>Result Copied!</span>
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy Result Text Only
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
