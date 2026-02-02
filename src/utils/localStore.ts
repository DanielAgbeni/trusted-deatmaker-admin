export function getItemStorage(key: string, defaultValue = "") {
  if (typeof window !== "undefined") {
    // Client-side-only code
    const res = localStorage.getItem(key);
    return res ? JSON.parse(res) : defaultValue;
  }
  return defaultValue;
}

export function setItemStorage(key: string, value: any) {
  if (typeof window !== "undefined") {
    // Client-side-only code
    return localStorage.setItem(key, JSON.stringify(value));
  }
}
