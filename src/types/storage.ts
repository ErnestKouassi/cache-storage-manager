export type TStorage = {
  delete(key: string): void;
  deleteAll(): void;
  get<T = unknown>(key: string): T | string | null;
  has(key: string): boolean;
  readonly listener: Subscribe;
};

export type Unsubscribe = () => never;

export type Subscribe = (storage: any) => Unsubscribe;

export type TypeStorage = TStorage & {
  json<T>(parse?: boolean): T;
  set<T = unknown>(key: string, object: T): void;
};
