import { getStorage, isNull, json, map } from '../common';
import {
  Subscribe,
  TStorage,
  TypeStorage,
  Unsubscribe,
} from '../types/storage';

export const createStorage = (
  getStorageProvider: () => Storage
): TypeStorage => {
  const listeners = new Set<Subscribe>();

  const deleteItem = (key: string) => {
    getStorageProvider().removeItem(key);
    const store = json(getStorageProvider());
    listeners.forEach((fn) => fn(store));
  };

  return <
    TStorage & {
      json<T>(parse?: boolean): T;
      set<T = unknown>(key: string, object: T): void;
    }
  >(<unknown>{
    delete: deleteItem,
    listener: (fn: {
      (storage: unknown): Unsubscribe;
      (storage: unknown): Unsubscribe;
    }) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    json: <T>(parse = false) =>
      parse
        ? json(getStorageProvider())
        : (getStorageProvider() as unknown as T),
    has: (key: string) => {
      const item = getStorageProvider().getItem(key);
      return !isNull(item);
    },
    deleteAll: () => {
      map(getStorageProvider(), deleteItem);
      listeners.forEach((fn) => fn(getStorageProvider()));
    },
    get: <T>(key: string) => getStorage<T>(key, getStorageProvider()),
    set: (key: string, object: any) => {
      getStorageProvider().setItem(key, JSON.stringify(object));
      listeners.forEach((fn) => fn(getStorageProvider()));
    },
  });
};

export const SessionStorageManager: TypeStorage = createStorage(
  () => window.sessionStorage
);

export const LocalStorageManager = createStorage(() => window.localStorage);
