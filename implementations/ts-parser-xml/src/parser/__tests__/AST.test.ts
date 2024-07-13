import { nodeFactory, NodeType, DocumentType } from '~/parser/AST';

describe('AST nodeFactory', () => {
  const RAW_TEXT = `a?@#$%ˆ!*&.,/\\asdasqrgb12455364ç#$()!a`;

  it('create a prolog object', () => {
    let encoding: string | undefined;
    let version: string | undefined;

    expect(
      nodeFactory.Prolog({ doctype: DocumentType.XML, encoding, version })
    ).toEqual({
      doctype: DocumentType.XML,
      encoding,
      version,
    });

    encoding = 'UTF-8';
    version = '1.0';

    expect(
      nodeFactory.Prolog({ doctype: DocumentType.HTML, encoding, version })
    ).toEqual({
      doctype: DocumentType.HTML,
      encoding,
      version,
    });
  });

  it('create a text node', () => {
    const value = 'Hello World!';

    expect(nodeFactory.Text(value)).toEqual({
      type: NodeType.Text,
      value,
    });
  });

  it('create a cdata node', () => {
    const value = RAW_TEXT;

    expect(nodeFactory.CData(value)).toEqual({
      type: NodeType.CData,
      value,
    });
  });

  it('create a raw text node', () => {
    const value = RAW_TEXT;

    expect(nodeFactory.RawText(value)).toEqual({
      type: NodeType.RawText,
      value,
    });
  });

  // TODO: review and improve tests cases
  describe('element', () => {
    it('crete a auto close element node', () => {
      const type = NodeType.AutoCloseElement;
      const name = 'hello';

      expect(
        nodeFactory.Element({
          type,
          name,
        })
      ).toEqual({
        type,
        name,
        attributes: undefined,
        children: undefined,
      });
    });

    it('crete a void element node', () => {
      const type = NodeType.VoidElement;
      const name = 'void';

      expect(
        nodeFactory.Element({
          type,
          name,
        })
      ).toEqual({
        type,
        name,
        attributes: undefined,
        children: undefined,
      });
    });

    it('create a special element node', () => {
      const name = 'special';
      const rawText = nodeFactory.RawText(RAW_TEXT);

      expect(
        nodeFactory.SpecialElement({
          name,
          content: rawText,
        })
      ).toEqual({
        type: NodeType.SpecialElement,
        name,
        content: {
          type: NodeType.RawText,
          value: RAW_TEXT,
        },
      });
    });

    it('create a element node', () => {
      const name = 'hello';

      expect(
        nodeFactory.Element({
          name,
        })
      ).toEqual({
        type: NodeType.Element,
        name,
        attributes: undefined,
        children: undefined,
      });
    });

    it('create a element node which children', () => {
      const parentName = 'parent';
      const childName = 'son';

      expect(
        nodeFactory.Element({
          name: parentName,
          children: [nodeFactory.Element({ name: childName })],
        })
      ).toEqual({
        type: NodeType.Element,
        name: parentName,
        attributes: undefined,
        children: [
          {
            type: NodeType.Element,
            name: childName,
            attributes: undefined,
            children: undefined,
          },
        ],
      });
    });
  });

  it('create a document node', () => {
    const prolog = nodeFactory.Prolog({ doctype: DocumentType.XML });
    const element = nodeFactory.Element({ name: 'hello' });
    const document = nodeFactory.Document({ prolog, root: element });

    expect(document).toEqual({
      type: NodeType.Document,
      prolog: {
        doctype: DocumentType.XML,
        version: undefined,
        encoding: undefined,
      },
      root: {
        type: NodeType.Element,
        name: 'hello',
        attributes: undefined,
        children: undefined,
      },
    });
  });
});
