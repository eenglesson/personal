'use client';

import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}

const POLL_INTERVAL = 10000;

export default function SpotifyPlayer() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify/now-playing');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: NowPlayingData = await res.json();
      setData(newData);
      lastFetchRef.current = Date.now();

      if (newData.isPlaying && newData.progressMs && newData.durationMs) {
        setProgress((newData.progressMs / newData.durationMs) * 100);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Smooth progress animation (only when playing)
  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (data?.isPlaying && data.durationMs) {
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - lastFetchRef.current;
        const currentProgress = (data.progressMs || 0) + elapsed;
        const percent = Math.min(
          (currentProgress / data.durationMs!) * 100,
          100
        );
        setProgress(percent);
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [data]);

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  if (loading) {
    return <SpotifyPlayerSkeleton />;
  }

  if (!data?.title) {
    return <NotPlayingState />;
  }

  return (
    <motion.a
      href={data.songUrl}
      target='_blank'
      rel='noopener noreferrer'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-green-500/50 transition-colors group'
    >
      {/* Album Art */}
      <div className='relative shrink-0'>
        {data.albumImageUrl ? (
          <Image
            src={data.albumImageUrl}
            alt={data.album || 'Album Art'}
            width={48}
            height={48}
            className='w-12 h-12 rounded shadow-md'
          />
        ) : (
          <div className='w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center'>
            <Music className='w-6 h-6 text-zinc-400' />
          </div>
        )}
        {/* Playing indicator */}
        {data.isPlaying && (
          <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1'>
            <EqualizerBars />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-xs text-zinc-500 dark:text-zinc-400 mb-0.5'>
          {data.isPlaying ? 'Now playing' : 'Last listened to'}
        </p>
        <p className='text-sm font-medium truncate text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
          {data.title}
        </p>
        <p className='text-xs text-zinc-500 dark:text-zinc-400 truncate'>
          {data.artist}
        </p>

        {/* Progress Bar - only show when playing */}
        {data.isPlaying && data.durationMs && (
          <div className='mt-1.5 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-green-500'
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </div>
        )}
      </div>

      {/* Spotify Icon */}
      <SpotifyIcon className='w-5 h-5 text-green-500 shrink-0' />
    </motion.a>
  );
}

function EqualizerBars() {
  return (
    <div className='flex items-end gap-[2px] h-2.5 w-2.5'>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='w-[2px] bg-white rounded-full'
          animate={{ height: ['40%', '100%', '60%', '100%', '40%'] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function SpotifyPlayerSkeleton() {
  return (
    <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse'>
      <div className='w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800' />
      <div className='flex-1 space-y-2'>
        <div className='h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16' />
        <div className='h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4' />
        <div className='h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2' />
      </div>
      <div className='w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full' />
    </div>
  );
}

function NotPlayingState() {
  return (
    <div className='flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'>
      <div className='w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center'>
        <Music className='w-6 h-6 text-zinc-400' />
      </div>
      <div className='flex-1'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>Not playing</p>
      </div>
      <SpotifyIcon className='w-5 h-5 text-zinc-400 shrink-0' />
    </div>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
    </svg>
  );
}
