export const map = (
  object: Record<string, unknown>,
  callback: (x: string) => void
): void => {
  try {
    Object.keys(object).forEach(callback);
  } catch (error) {
    window.console.log(error);
  }
};

export const isNull = <T>(item: T) => item === null || item === undefined;

export const isPrimitive = (a: any) => {
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
