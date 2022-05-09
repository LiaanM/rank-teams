/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
import { Game } from '../types/game';
import { Team } from '../types/team';

/**
 * Converts a set of game results into a ranked table and returns the results.
 * Input is expected in the following format
 * ```
 *  Lions 3, Snakes 3
 *  Tarantulas 1, FC Awesome 0
 * ```
 *
 * ### Example (es module)
 * ```js
 * import { rank } from 'rank-teams'
 * const ranked = rank(`Lions 3, Snakes 3\nTarantulas 1, FC Awesome 0`);
 * console.log(const)
 * // => [
 * // => {name: "Tarantulas", points: 3},
 * // => {name: "Lions", points:1},
 * // => {name: "Snakes", points:1},
 * // => {name: "FC Awesome", points:0}
 * // => ]
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var rank = require('rank-teams').rank;
 * const ranked = rank(`Lions 3, Snakes 3\nTarantulas 1, FC Awesome 0`);
 * console.log(const)
 *  // => [
 *  // => {name: "Tarantulas", points: 3},
 *  // => {name: "Lions", points:1},
 *  // => {name: "Snakes", points:1},
 *  // => {name: "FC Awesome", points:0}
 *  // => ]
 * ```
 *
 * @param input - String containing lines for each game: "{team1_name} {score},{team2_name} {score}\n"
 * @returns Returns array of objects containing name and points
 */
export const rank = (input: string): Team[] => {
  //Parse games
  const games = parse(input);
  //Calculate scores
  const teams = calculateScores(games);

  //Sort
  teams.sort((teamA, teamB) => {
    if (teamA.points > teamB.points) return -1;
    else if (teamB.points > teamA.points) return 1;
    else return teamA.name.localeCompare(teamB.name);
  });

  //Return
  return teams;
};

const parse = (input: string): Game[] => {
  const lines = input.split(/\r?\n/);

  const games: Game[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const results = trimmed.split(',');
    const teamA = results[0].match(/([^0-9]+)(\s\d+$)/);
    const teamB = results[1].match(/([^0-9]+)(\s\d+$)/);
    const game: Game = {
      teamAName: teamA[1].trim(),
      teamAScore: +teamA[2],
      teamBName: teamB[1].trim(),
      teamBScore: +teamB[2],
    };

    games.push(game);
  }
  return games;
};

const calculateScores = (games: Game[]): Team[] => {
  const teams = {};
  games.forEach((game) => {
    if (!teams[game.teamAName]) teams[game.teamAName] = 0;
    if (!teams[game.teamBName]) teams[game.teamBName] = 0;

    if (game.teamAScore > game.teamBScore) {
      //Team A wins
      teams[game.teamAName] += 3;
    } else if (game.teamBScore > game.teamAScore) {
      //Team B wins
      teams[game.teamBName] += 3;
    } else {
      //Draw
      teams[game.teamAName] += 1;
      teams[game.teamBName] += 1;
    }
  });
  const results: Team[] = [];
  for (const team in teams) {
    const points = teams[team];
    results.push({ name: team, points });
  }
  return results;
};
