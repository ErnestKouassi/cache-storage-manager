export const map = (
  object: Record<string, unknown>,
  callback: (key: string) => unknown
) => {
  try {
    Object.keys(object).forEach(callback);
  } catch (error) {
    window.console.log(error);
  }
};

export const isNull = <T>(item: T) => item === null || item === undefined;

export const isPrimitive = (a?: string | number | boolean) => {
  const type = typeof a;

  return (
    type === 'string' || type === 'number' || type === 'boolean' || isNull(a)
  );
};

export const getStorage = <T>(key: string, storage: Storage) => {
  const str = storage.getItem(key);
  try {
    return JSON.parse(str as never) as T;
  } catch (error) {
    return str ?? null;
  }
};

export const json = <T extends Record<string, never>>(storage: Storage): T =>
  Object.keys(storage).reduce<T>(
    (acc, key) => ({
      ...acc,
      [key]: getStorage(key, storage),
    }),
    {} as T
  );

export type TPrimitive = string | number | boolean;
