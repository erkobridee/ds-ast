import { Parser } from '~/parser';

it('thow exception on empty source', () => {
  const parser = new Parser();

  expect(() => parser.parse()).toThrow('There is no source code to parse');

  expect(() => parser.parse(`a123abc`)).toThrow(/^Unexpected token: "/);
});
