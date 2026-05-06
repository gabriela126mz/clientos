export const saveFormValue = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFormValue = (key: string) => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const clearFormValue = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};