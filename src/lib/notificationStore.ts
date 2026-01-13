// Notification Store
// In production, use Redis, Postgres, or another persistent database

type NotificationDetails = {
  url: string;
  token: string;
};

// In-memory storage (resets on deployment!)
const store = new Map<number, NotificationDetails>();

export const notificationStore = {
  get: (fid: number): NotificationDetails | undefined => {
    return store.get(fid);
  },
  
  set: (fid: number, details: NotificationDetails): void => {
    store.set(fid, details);
    console.log(`[NotificationStore] Saved for FID ${fid}`);
  },
  
  delete: (fid: number): boolean => {
    const result = store.delete(fid);
    console.log(`[NotificationStore] Deleted FID ${fid}: ${result}`);
    return result;
  },
  
  has: (fid: number): boolean => {
    return store.has(fid);
  },
  
  // Get all stored FIDs (useful for broadcasting)
  getAllFids: (): number[] => {
    return Array.from(store.keys());
  },
  
  // Get count
  count: (): number => {
    return store.size;
  },
};

export type { NotificationDetails };
