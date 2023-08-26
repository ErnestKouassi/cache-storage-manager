export type TStorage = TListener & {
  delete(key: string): void;
  deleteAll(): void;
  get<T = unknown>(key: string): T | string | null;
  has(key: string): boolean;
};

export type Unsubscribe = () => never;

export type Subscribe = (storage: unknown) => Unsubscribe;
export type TListener = {
  readonly listener: Subscribe;
};

export type TypeStorage = TStorage & {
  json<T>(parse?: boolean): T;
  set<T = unknown>(key: string, object: T): void;
};
