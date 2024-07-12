import { Parser, AvailableParsers } from '~/parser';

describe('HTML Parser', () => {
  it('check the parser instance type', () => {
    const parser = new Parser(AvailableParsers.HTML);
    expect(parser).toBeInstanceOf(Parser);
    expect(parser.type).toBe(AvailableParsers.HTML);
  });

  it(`should throw an error when there's no source`, () => {
    const parser = new Parser(AvailableParsers.HTML);
    expect(() => parser.parse()).toThrow(/^There is no source code to parse$/);
  });

  // TODO: implement more tests cases
});
