import test from 'ava';

import { rank } from './rank';

test('rank', (t) => {
  const expected = [
    { name: 'Tarantulas', points: 9 },
    { name: 'Lions', points: 5 },
    { name: 'FC Awesome', points: 1 },
    { name: 'Snakes', points: 1 },
    { name: 'Grouches', points: 0 },
  ];
  const input = `
    Lions 3, Snakes 3
    Tarantulas 1, FC Awesome 0
    Lions 1, FC Awesome 1
    Tarantulas 3, Snakes 1
    Lions 4, Grouches 0
    Lions 0, Tarantulas 3
    `;
  const result = rank(input);
  t.deepEqual(result, expected);
});
