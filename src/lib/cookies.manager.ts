import { isNull, isPrimitive } from '../common';
import type {
  SetCookies,
  SetCookiesParser,
  TypeCookieStorage,
} from '../types/cookies';
import { Subscribe, Unsubscribe } from '../types/storage';

const fnDate = (str: number | string | Date) => {
  if (str instanceof Date) return str;

  return typeof str === 'number'
    ? new Date((new Date() as never) * 1 + (str as number) * 864e5)
    : str;
};

const zeroEpoch = '1969-12-31T23:59:59.000Z';

const json = <T>(): T => {
  const cookie = document.cookie;

  if (cookie === '') {
    return {} as T;
  }

  return document.cookie
    .split('; ')
    .map((v) => v.split('='))
    .reduce((acc: any, v: ReadonlyArray<string>) => {
      const data = JSON.parse(
        `{${decodeURIComponent(v[0].trim())}: ${decodeURIComponent(
          v[1].trim()
        )}}`
      );

      return { ...acc, ...data };
    }, {});
};

const listeners = new Set<Subscribe>();

const callListeners = () => {
  const store = json();
  listeners.forEach((fn) => fn(store));
};

const parsers: SetCookiesParser = [
  {
    name: 'expires',
    parse: (opts) => `expires=${fnDate(opts.expires ?? zeroEpoch)}`,
  },
  {
    name: 'maxAge',
    parse: (opts) =>
      opts.maxAge ? `max-age=${fnDate(opts.expires ?? zeroEpoch)}` : '',
  },
  { name: 'path', parse: (opts) => `path=${opts.path ?? '/'}` },
  {
    name: 'sameSite',
    parse: (opts) => `samesite=${opts.sameSite ?? 'strict'}`,
  },
  {
    name: 'useSecure',
    parse: (opts) => `${opts.useSecure ?? true ? 'secure' : ''}`,
  },
  {
    name: 'domain',
    parse: (opts) => {
      const domain = opts.domain ?? '';
      if (domain === '') return '';
      return `domain=${opts.multiDomain ? '.' : ''}${domain}`;
    },
  },
  {
    name: 'partitioned',
    parse: (opts) => (opts.partitioned ? `Partitioned` : ''),
  },
];

export const CookiesManager: TypeCookieStorage = {
  delete: (key: string) => {
    document = {
      ...document,
      cookie: `${encodeURIComponent(key)}=;expires=${new Date().toUTCString()}`,
    };
    callListeners();
  },
  deleteAll: () => {
    document.cookie.split(';').forEach((cookie) => {
      document = {
        ...document,
        cookie: cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`),
      };
    });
    callListeners();
  },
  get: <E>(key: string): E | null => {
    const value = (CookiesManager.json<E>() as unknown)[key];

    if (isNull(value)) {
      return null;
    }
    try {
      return JSON.parse(decodeURIComponent(value)) as E;
    } catch (error) {
      return value;
    }
  },
  has: (key) =>
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith(`${key}=`)),
  json,
  listener: (fn: {
    (storage: unknown): Unsubscribe;
    (storage: unknown): Unsubscribe;
  }) => {
    listeners.add(fn);

    return () => listeners.delete(fn);
  },
  set: (key: string, object: any, opts: SetCookies = {}) => {
    const value = isPrimitive(object)
      ? object
      : encodeURIComponent(JSON.stringify(object));

    document = {
      ...document,
      cookie: parsers
        .reduce<readonly string[]>(
          (acc, el) => {
            const val = el.parse(opts);
            return val === '' ? acc : acc.concat(val);
          },
          [`${encodeURIComponent(key)}=${value}`]
        )
        .join(';'),
    };

    callListeners();
  },
};
