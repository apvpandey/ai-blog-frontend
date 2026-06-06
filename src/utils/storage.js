// LocalStorage utility helpers

export function getFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving "${key}" to localStorage:`, error);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing "${key}" from localStorage:`, error);
  }
}

export function generateId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
