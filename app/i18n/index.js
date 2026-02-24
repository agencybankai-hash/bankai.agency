import { ru } from "./ru";
import { en } from "./en";

export const locales = ["ru", "en"];
export const defaultLocale = "ru";

const dictionaries = { ru, en };

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
