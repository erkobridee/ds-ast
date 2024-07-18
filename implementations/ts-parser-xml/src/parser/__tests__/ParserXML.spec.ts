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

    describe('without xml declaration', () => {
      it('auto close', () => {
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

      it('open and close', () => {
        const source = `<hello></hello>`;
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

        expect(ast).toEqual(expected);
      });
    });

    it('throw error to due to wrong tag closing', () => {
      const source = `<tag-a></tag-b>`;

      expect(() => parser.parse(source)).toThrow(
        /^CloseTag: Unexpected tag production. Wrong closing tag, it was expected /
      );
    });
  });

  describe('single tag with text content', () => {
    it('with xml declaration', () => {
      const source = `
        <?xml version="1.0" encoding="UTF-8"?>
        <message>Hello World!</message>
      `;

      const ast = parser.parse(source);

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

      expect(ast).toEqual(expected);
    });

    it('without xml declaration', () => {
      const source = `<message>Hello World!</message>`;
      const ast = parser.parse(source);

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

      expect(ast).toEqual(expected);
    });
  });

  describe('tag with children', () => {
    it('single son', () => {
      const source = `
        <message>
          <p>Hello World!</p>
        </message>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'message',
        children: [
          nodeFactory.Element({
            name: 'p',
            children: [nodeFactory.Text('Hello World!')],
          }),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('text tag', () => {
      const source = `
        <tag-1>
          Hello World! <tag-2/>
        </tag-1>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'tag-1',
        children: [
          nodeFactory.Text('Hello World! '),
          nodeFactory.Element({
            name: 'tag-2',
          }),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('tag text', () => {
      const source = `
        <tag-1>
          <tag-2/> Hello World!
        </tag-1>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'tag-1',
        children: [
          nodeFactory.Element({
            name: 'tag-2',
          }),
          nodeFactory.Text(`Hello World!
        `),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('text tag text', () => {
      const source = `
        <tag-1>
          Hello <tag-2/> World!
        </tag-1>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'tag-1',
        children: [
          nodeFactory.Text('Hello '),
          nodeFactory.Element({
            name: 'tag-2',
          }),
          nodeFactory.Text(`World!
        `),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('two level deep', () => {
      const source = `
        <tag-1>
          <tag-2 attr1="value 1">Hello World!</tag-2>
        </tag-1>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'tag-1',
        children: [
          nodeFactory.Element({
            name: 'tag-2',
            attributes: {
              attr1: 'value 1',
            },
            children: [nodeFactory.Text('Hello World!')],
          }),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });

    it('three level deep', () => {
      const source = `
        <tag-1 has-children>
          <tag-2 attr="value of tag-2">
            <tag-3 attr="value of tag-3" isMessage is-present>Hello World!</tag-3>
          </tag-2>
        </tag-1>
      `;

      const ast = parser.parse(source);

      const prolog = nodeFactory.Prolog({
        doctype: DocumentType.XML,
      });

      const root = nodeFactory.Element({
        name: 'tag-1',
        attributes: {
          'has-children': undefined,
        },
        children: [
          nodeFactory.Element({
            name: 'tag-2',
            attributes: {
              attr: 'value of tag-2',
            },
            children: [
              nodeFactory.Element({
                name: 'tag-3',
                attributes: {
                  attr: 'value of tag-3',
                  isMessage: undefined,
                  'is-present': undefined,
                },
                children: [nodeFactory.Text('Hello World!')],
              }),
            ],
          }),
        ],
      });

      const expected = nodeFactory.Document({
        prolog,
        root: root,
      });

      expect(ast).toEqual(expected);
    });
  });
});
