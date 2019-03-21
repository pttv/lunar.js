/**
 * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
 * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
 *
 * Permission to use, copy, modify, and redistribute this software and its
 * documentation for personal, non-commercial use is hereby granted provided that
 * this copyright notice and appropriate documentation appears in all copies.
 */

const STEMS_MAPPING = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];

const BRANCHES_MAPPING = [
  'tys',
  'suu',
  'dan',
  'mao',
  'thin',
  'tyj',
  'ngo',
  'mui',
  'than',
  'dau',
  'tuat',
  'hoi',
];

/**
 * Discard the fractional part of a number, e.g., floor(3.2) = 3
 */
const floor = date => Math.floor(date);

/**
 * Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
 * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
 * Formula from http://www.tondering.dk/claus/calendar.html
 */
function jdFromDate(dd, mm, yy) {
  const a = floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd
    + floor((153 * m + 2) / 5)
    + 365 * y
    + floor(y / 4)
    - floor(y / 100)
    + floor(y / 400)
    - 32045;

  if (jd < 2299161) jd = dd + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - 32083;
  return jd;
}

/**
 * Convert a Julian day number to day/month/year. Parameter jd is an integer
 */
function jdToDate(jd) {
  let a;
  let b;
  let c;

  if (jd > 2299160) {
    // After 5/10/1582, Gregorian calendar
    a = jd + 32044;
    b = floor((4 * a + 3) / 146097);
    c = a - floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }

  const d = floor((4 * c + 3) / 1461);
  const e = c - floor((1461 * d) / 4);
  const m = floor((5 * e + 2) / 153);
  const day = e - floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * floor(m / 10);
  const year = b * 100 + d - 4800 + floor(m / 10);
  return [day, month, year];
}

/**
 * Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
 * (measured as the number of days since 1/1/4713 BC noon UCT,
 * e.g., 2451545.125 is 1/1/2000 15:00 UTC).
 * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function getNewMoon(k) {
  let deltaT;
  const T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  // Mean new moon
  const Jd1 = 2415020.75933
    + 29.53058868 * k
    + 0.0001178 * T2
    - 0.000000155 * T3
    + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  // Sun's mean anomaly
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;

  // Moon's mean anomaly
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;

  // Moon's argument of latitude
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  if (T < -11) {
    deltaT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  const JdNew = Jd1 + C1 - deltaT;
  return JdNew;
}

/* Compute the longitude of the sun at any time.
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
  const T2 = T * T;
  const dr = Math.PI / 180; // degree to radian

  // mean anomaly, degree
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL; // true longitude, degree
  L *= dr;
  L -= Math.PI * 2 * floor(L / (Math.PI * 2)); // Normalize to (0, 2*Math.PI)
  return L;
}

/* Compute sun position at midnight of the day with the given Julian day number.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The function returns a number between 0 and 11.
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
 * After that, return 1, 2, 3 ...
 */
function getSunLongitude(dayNumber, timeZone) {
  return floor((SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6);
}

/* Compute the day of the k-th new moon in the given time zone.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
 */
function getNewMoonDay(k, timeZone) {
  return floor(getNewMoon(k) + 0.5 + timeZone / 24);
}

/* Find the day that starts the luner month 11 of the given year for the given time zone */
function getLunarMonth11(yy, timeZone) {
  // off = jdFromDate(31, 12, yy) - 2415021.076998695;
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

/* Find the index of the leap month after the month starting on the day a11. */
function getLeapMonthOffset(a11, timeZone) {
  const k = floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1; // We start with the month following lunar month 11
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i += 1;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
function convertSolar2Lunar(hh, dd, mm, yy, timeZone) {
  let monthStart;
  let a11;
  let b11;
  let lunarMonth;
  let lunarYear;
  let lunarLeap;
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = floor((dayNumber - 2415021.076998695) / 29.530588853);
  monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  // alert(dayNumber+" -> "+monthStart);
  a11 = getLunarMonth11(yy, timeZone);
  b11 = a11;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = floor((monthStart - a11) / 29);
  lunarLeap = 0;
  lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  const lunarHour = floor(((hh + 1) % 24) / 2);
  return [lunarHour, lunarDay, lunarMonth, lunarYear, lunarLeap];
}

export function convertSolarToSexagenary(hh, dd, mm, yy, timeZone) {
  const dayNumber = jdFromDate(dd, mm, yy);

  /* eslint-disable no-unused-vars */
  const [lunarHour, lunarDay, lunarMonth, lunarYear] = convertSolar2Lunar(hh, dd, mm, yy, timeZone);

  const yearStem = STEMS_MAPPING[(lunarYear + 6) % 10];
  const yearBranch = BRANCHES_MAPPING[(lunarYear + 8) % 12];
  const monthStem = STEMS_MAPPING[(lunarYear * 12 + lunarMonth + 3) % 10];
  const monthBranch = BRANCHES_MAPPING[(lunarMonth + 1) % 12];
  const dayStem = STEMS_MAPPING[(dayNumber + 9) % 10];
  const dayBranch = BRANCHES_MAPPING[(dayNumber + 1) % 12];
  const hourStem = STEMS_MAPPING[(((dayNumber + 9) % 5) * 2 + lunarHour) % 10];
  const hourBranch = BRANCHES_MAPPING[lunarHour];

  return [
    [yearStem, yearBranch].join(' '),
    [monthStem, monthBranch].join(' '),
    [dayStem, dayBranch].join(' '),
    [hourStem, hourBranch].join(' '),
  ];
}

/* Convert a lunar date to the corresponding solar date */
export function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
  let a11;
  let b11;
  let leapOff;
  let leapMonth;

  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  const k = floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;

  if (b11 - a11 > 365) {
    leapOff = getLeapMonthOffset(a11, timeZone);
    leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (lunarLeap !== 0 && lunarMonth !== leapMonth) return [0, 0, 0];
    if (lunarLeap !== 0 || off >= leapOff) off += 1;
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

function asserts() {
  console.assert(
    convertSolarToSexagenary(7 + 15 / 60, 5, 1, 1996, 7).join()
      === ['at hoi', 'mau tys', 'tan suu', 'nham thin'].join(),
    'Test case #1',
  );
  console.assert(
    convertSolarToSexagenary(21 + 5 / 60, 23, 12, 1994, 7).join()
      === ['giap tuat', 'binh tys', 'quy mui', 'quy hoi'].join(),
    'Test case #2',
  );
  console.assert(
    convertSolarToSexagenary(17 + 5 / 60, 25, 4, 1993, 7).join()
      === ['quy dau', 'binh thin', 'binh tys', 'dinh dau'].join(),
    'Test case #3',
  );
  console.assert(
    convertSolarToSexagenary(8 + 35 / 60, 28, 6, 1994, 7).join()
      === ['giap tuat', 'canh ngo', 'at dau', 'canh thin'].join(),
    'Test case #4',
  );
  console.assert(
    convertSolarToSexagenary(7 + 5 / 60, 21, 8, 1995, 7).join()
      === ['at hoi', 'giap than', 'giap than', 'mau thin'].join(),
    'Test case #5',
  );
  console.assert(
    convertSolarToSexagenary(4, 20, 2, 1992, 7).join()
      === ['nham than', 'nham dan', 'binh dan', 'canh dan'].join(),
    'Test case #6',
  );
  console.assert(
    convertSolarToSexagenary(22 + 25 / 60, 11, 11, 1999, 7).join()
      === ['ky mao', 'at hoi', 'dinh mao', 'tan hoi'].join(),
    'Test case #7',
  );
  console.assert(
    convertSolarToSexagenary(7, 20, 12, 1973, 7).join()
      === ['quy suu', 'giap tys', 'canh dan', 'canh thin'].join(),
    'Test case #8',
  );
  console.assert(
    convertSolarToSexagenary(21 + 15 / 60, 10, 12, 1993, 7).join()
      === ['quy dau', 'quy hoi', 'at suu', 'dinh hoi'].join(),
    'Test case #9',
  );
}

asserts();