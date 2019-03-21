declare module 'lunar.js' {
  /**
   * Convert solar date to lunar date
   *
   * @param hh Solar hour
   * @param dd Solar day
   * @param mm Solar month
   * @param yy Solar year
   * @param tz Time zone
   * @returns Tuple of (hour, day, month, year, isLeap) in Lunar calendar
   */
  export function convertSolarToLunar(
    hh: number,
    dd: number,
    mm: number,
    yy: number,
    tz: number,
  ): [number, number, number, number, boolean];

  /**
   * Convert solar date to sexagenary dates
   *
   * @param hh Solar hour
   * @param dd Solar date
   * @param mm Solar month
   * @param yy Solar year
   * @param tz Time zone
   * @returns Tuple of (hour, day, month, year) in form of Sexagenary pairs
   */
  export function convertSolarToSexagenary(hh: number, dd: number, mm: number, yy: number, tz: number): [[string]];

  /**
   * Convert lunar date to solar date
   * 
   * @param dd Lunar day
   * @param mm Lunar month
   * @param yy Lunar year
   * @param isLeap Is lunar month leap?
   * @param tz Time zone
   * @returns Tuple of (day, month, year) in Solar calendar
   */
  export function convertLunarToSolar(
    dd: number,
    mm: number,
    yy: number,
    isLeap: boolean,
    tz: number,
  ): [number, number, number];
}
