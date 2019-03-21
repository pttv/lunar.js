import { convertSolarToSexagenary } from './index';

const TEST_SUITS = [
  {
    input: [7 + 15 / 60, 5, 1, 1996, 7],
    output: ['at hoi', 'mau tys', 'tan suu', 'nham thin'],
  },
  {
    input: [21 + 5 / 60, 23, 12, 1994, 7],
    output: ['giap tuat', 'binh tys', 'quy mui', 'quy hoi'],
  },
  {
    input: [17 + 5 / 60, 25, 4, 1993, 7],
    output: ['quy dau', 'binh thin', 'binh tys', 'dinh dau'],
  },
  {
    input: [8 + 35 / 60, 28, 6, 1994, 7],
    output: ['giap tuat', 'canh ngo', 'at dau', 'canh thin'],
  },
  {
    input: [7 + 5 / 60, 21, 8, 1995, 7],
    output: ['at hoi', 'giap than', 'giap than', 'mau thin'],
  },
  {
    input: [4, 20, 2, 1992, 7],
    output: ['nham than', 'nham dan', 'binh dan', 'canh dan'],
  },
  {
    input: [22 + 25 / 60, 11, 11, 1999, 7],
    output: ['ky mao', 'at hoi', 'dinh mao', 'tan hoi'],
  },
  {
    input: [7, 20, 12, 1973, 7],
    output: ['quy suu', 'giap tys', 'canh dan', 'canh thin'],
  },
  {
    input: [21 + 15 / 60, 10, 12, 1993, 7],
    output: ['quy dau', 'quy hoi', 'at suu', 'dinh hoi'],
  },
];

/* eslint-disable no-console */

TEST_SUITS.forEach(({ input, output }, index) => {
  console.assert(convertSolarToSexagenary(...input).join() === output.join(), `Test case #${index + 1}`);
});
