import { Preferences } from '@capacitor/preferences';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const get = async () => {
    const { value } = await Preferences.get({ key });

    return value ? (JSON.parse(value) as T) : initialValue;
  };

  const set = async (value: T) => {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  };

  const remove = async () => {
    await Preferences.remove({ key });
  };

  return { get, remove, set };
};
