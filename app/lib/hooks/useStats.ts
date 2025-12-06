'use client';

import { useState, useEffect } from 'react';

export interface Stats {
  casesSolved: number;
  solveRate: number;
  detectivesCount: number;
  casesAvailable: number;
  updatedAt: string;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to zeros if fetch fails
        setStats({
          casesSolved: 0,
          solveRate: 0,
          detectivesCount: 0,
          casesAvailable: 0,
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
