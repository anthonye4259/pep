const STORAGE_KEY = 'peptidai_data';

const defaultData = {
  protocol: [],
  doseLog: [],
  progress: [],
  settings: {
    notifications: true,
    theme: 'dark',
    units: 'mcg'
  },
  streak: {
    current: 0,
    best: 0,
    lastLogDate: null
  }
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed };
  } catch {
    return { ...defaultData };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
