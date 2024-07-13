import { Parser, AvailableParsers, NodeType } from '~/parser';

describe('XML Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(AvailableParsers.XML);
  });

  it('check the parser instance type', () => {
    expect(parser).toBeInstanceOf(Parser);
    expect(parser.type).toBe(AvailableParsers.XML);
  });

  it(`should throw an error when there's no source`, () => {
    expect(() => parser.parse()).toThrow(/^There is no source code to parse$/);
  });

  describe('single tag', () => {
    it.skip('with xml declaration', () => {
      // TODO: review

      const source = `<?xml version="1.0" encoding="UTF-8"?><hello />`;
      const ast = parser.parse(source);

      expect(ast).toMatchObject({
        type: NodeType.Document,
      });
    });

    it.skip('without xml declaration', () => {});
  });

  // TODO: implement more tests cases
});
