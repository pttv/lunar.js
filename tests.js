import { convertSolarToSexagenary } from './index.es5';

const TEST_SUITS = [
  {
    input: [7 + 15 / 60, 5, 1, 1996, 7],
    output: [['nham', 'thin'], ['tan', 'suu'], ['mau', 'tys'], ['at', 'hoi']],
  },
  {
    input: [21 + 5 / 60, 23, 12, 1994, 7],
    output: [['quy', 'hoi'], ['quy', 'mui'], ['binh', 'tys'], ['giap', 'tuat']],
  },
  {
    input: [17 + 5 / 60, 25, 4, 1993, 7],
    output: [['dinh', 'dau'], ['binh', 'tys'], ['binh', 'thin'], ['quy', 'dau']],
  },
  {
    input: [8 + 35 / 60, 28, 6, 1994, 7],
    output: [['canh', 'thin'], ['at', 'dau'], ['canh', 'ngo'], ['giap', 'tuat']],
  },
  {
    input: [7 + 5 / 60, 21, 8, 1995, 7],
    output: [['mau', 'thin'], ['giap', 'than'], ['giap', 'than'], ['at', 'hoi']],
  },
  {
    input: [4, 20, 2, 1992, 7],
    output: [['canh', 'dan'], ['binh', 'dan'], ['nham', 'dan'], ['nham', 'than']],
  },
  {
    input: [22 + 25 / 60, 11, 11, 1999, 7],
    output: [['tan', 'hoi'], ['dinh', 'mao'], ['at', 'hoi'], ['ky', 'mao']],
  },
  {
    input: [7, 20, 12, 1973, 7],
    output: [['canh', 'thin'], ['canh', 'dan'], ['giap', 'tys'], ['quy', 'suu']],
  },
  {
    input: [21 + 15 / 60, 10, 12, 1993, 7],
    output: [['dinh', 'hoi'], ['at', 'suu'], ['quy', 'hoi'], ['quy', 'dau']],
  },
];

/* eslint-disable no-console */

TEST_SUITS.forEach(({ input, output }, index) => {
  console.assert(convertSolarToSexagenary(...input).join() === output.join(), `Test case #${index + 1}`);
});
