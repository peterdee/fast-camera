export type DataKey = 'settings';

interface StoredItem<T> {
  value: T;
}

export function getData<T>(key: DataKey): null | T {
  const string = localStorage.getItem(key);
  if (!string) {
    return null;
  }
  try {
    const storedItem: StoredItem<T> = JSON.parse(string);
    return storedItem.value;
  } catch {
    return null;
  }
}

export function setData<T>(key: DataKey, value: T): void {
  const storedItem = { value };
  return localStorage.setItem(
    key,
    JSON.stringify(storedItem),
  );
}
