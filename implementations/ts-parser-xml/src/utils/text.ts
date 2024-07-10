/**
 * From a given text count the number of lines
 *
 * @param {string} text
 * @returns number
 */
export const countLines = (text: string) =>
  (text.match(/\n/g) || '').length + 1;

/**
 * Generate a truncated text when its length is greater than `maxLength`
 *
 * @param {string} text
 * @param {number} maxLength - default value is `50`
 * @returns the truncated text with ellipsis
 */
export const truncate = (text: string, maxLength = 50) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}…` : text;
