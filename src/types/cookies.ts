import { TStorage } from './storage';

type TCookiesAge = number | string | Date;

export type SetCookiesParser = ReadonlyArray<{
  readonly name: keyof SetCookies;
  readonly parse: (opts: SetCookies) => string;
}>;

export type SetCookies = Partial<{
  readonly domain: string;
  readonly expires: TCookiesAge;
  readonly maxAge: TCookiesAge;
  readonly multiDomain?: boolean;
  readonly partitioned: boolean;
  readonly path: string;
  readonly sameSite: 'strict' | 'lax' | 'none' | '';
  readonly useSecure: boolean;
}>;

export type TypeCookieStorage = TStorage & {
  json<T>(): T;
  set<T = unknown>(key: string, object: T, parameters?: SetCookies): void;
};
