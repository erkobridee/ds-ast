import { Parser, AvailableParsers } from '~/parser';

describe('HTML Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(AvailableParsers.HTML);
  });

  it('check the parser instance type', () => {
    expect(parser).toBeInstanceOf(Parser);
    expect(parser.type).toBe(AvailableParsers.HTML);
  });

  it(`should throw an error when there's no source`, () => {
    expect(() => parser.parse()).toThrow(/^There is no source code to parse$/);
  });

  // TODO: implement more tests cases
});
