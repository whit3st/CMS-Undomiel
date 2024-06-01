/**
 * Retrieves an item from localStorage and attempts to parse it as JSON. If parsing fails, the item is returned as is.
 *
 * @param {string} item - The key of the item to retrieve from localStorage.
 * @return {T | null} The parsed value of the item from localStorage, or the item itself if parsing fails, or null if the item is not found in localStorage.
 */
const ls = <T>(item: string): T | null => {
    const localS = localStorage.getItem(item);
    if (localS !== null) {
        try {
            return JSON.parse(localS) as T;
        } catch (e) {
            // If JSON.parse fails, return the item as is (assuming it's a string)
            return localS as unknown as T;
        }
    }
    return null;
};

export default ls;
