/** Type to store session storage keys */
type SessionStorageKey = 'token';

/**
 * Sets a value in the session storage using a specified key.
 * @param {T} key - Representing the key under which the value will bb stored in the session storage.
 * @param {string} value - String value that you want to store in the session storage under the specified key.
 */
export const setSessionStorageItem = async <T extends SessionStorageKey>(
  key: T,
  value: string
): Promise<void> => {
  if (key === 'token') await chrome.storage.session.set({ token: value });
};

/**
 * Retrieves a value from session storage based on the provided key.
 * @param {T} key - It is used to specify the key of the item you want to retrieve from the session storage.
 */
export const getSessionStorageItem = <T extends SessionStorageKey>(
  key: T
): Promise<string | null> =>
  chrome.storage.session
    .get('token')
    .then((data: Record<string, string>) => data[key]);

/**
 * Removes a specific item from the session storage based on the provided key
 * @param {T} key - It represents the key of the item that you want to remove from the session storage.
 */
export const removeSessionStorageItem = <T extends SessionStorageKey>(
  key: T
): void => sessionStorage.removeItem(key);
