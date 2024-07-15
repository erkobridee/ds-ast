import { Parser, AvailableParsers, NodeType } from '~/parser';
import { DocumentType, nodeFactory } from '~/parser/AST';

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
    it('with xml declaration', () => {
      const source = `<?xml version="1.0" encoding="UTF-8"?><hello />`;
      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
        version: '1.0',
        encoding: 'UTF-8',
      });

      const root = nodeFactory.Element({
        name: 'hello',
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('without xml declaration', () => {
      const source = `<hello />`;
      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'hello',
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toMatchObject(expected);
    });
  });

  describe('single tag with text content', () => {
    it('with xml declaration', () => {
      const source = `
        <?xml version="1.0" encoding="UTF-8"?>
        <message>Hello World!</message>
      `;

      const ast = parser.parse(source);

      // TODO: remove
      console.log(`ast: `, ast);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
        version: '1.0',
        encoding: 'UTF-8',
      });

      const root = nodeFactory.Element({
        name: 'message',
        children: [nodeFactory.Text('Hello World!')],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      // TODO: remove
      console.log(`expected:`, expected);

      expect(ast).toMatchObject(expected);
    });

    // TODO: fix the parser xml code flow
    it('without xml declaration', () => {
      const source = `<message>Hello World!</message>`;
      const ast = parser.parse(source);

      // TODO: remove
      console.log(`ast: `, ast);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'message',
        children: [nodeFactory.Text('Hello World!')],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      // TODO: remove
      console.log(`expected:`, expected);

      expect(ast).toMatchObject(expected);
    });
  });

  describe('tag with children', () => {
    it.skip('single son', () => {
      // TODO: define the code
    });

    it.skip('text tag', () => {
      // TODO: define the code
    });

    it.skip('tag text', () => {
      // TODO: define the code
    });

    it.skip('text tag text', () => {
      // TODO: define the code
    });

    // TODO: should I have a describe with multiple tests cases?
    it.skip('two level deep', () => {
      // TODO: define the code
    });

    // TODO: should I have a describe with multiple tests cases?
    it.skip('three level deep', () => {
      // TODO: define the code
    });
  });

  // TODO: implement more tests cases
});
