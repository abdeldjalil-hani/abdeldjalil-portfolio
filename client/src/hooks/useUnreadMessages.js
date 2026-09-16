import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../api/client';

/** Polls unread message count once on mount so the sidebar badge is fresh. */
export function useUnreadMessages(user) {
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await adminApi.messages('?page=1&limit=1&read=0');
      setUnread(data.meta?.total ?? 0);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return unread;
}