import { Token, tokenToString, buildToken, Spec } from '~/lexer/Token';

import { regexpIt } from './_helpers';

//----------------------------------------------------------------------------//

describe('Token', () => {
  it('buildTokenString', () => {
    expect(tokenToString(new Token('type'))).toBe('Token( type )');
    expect(tokenToString(new Token('type', 'lexeme'))).toBe(
      'Token( type, lexeme )'
    );
  });

  it('new Token', () => {
    let token = new Token('type');
    expect(token.type).toBe('type');
    expect(token.lexeme).toBeUndefined();
    expect(token.toString()).toBe(tokenToString(token));

    token = new Token('type', 'lexeme');
    expect(token.type).toBe('type');
    expect(token.lexeme).toBe('lexeme');
    expect(token.toString()).toBe(tokenToString(token));
  });

  describe('buildToken', () => {
    it('one argument', () => {
      const token = buildToken('type');
      expect(token.type).toBe('type');
      expect(token.lexeme).toBeUndefined();
      expect(token.toString()).toBe(tokenToString(token));
    });

    it('two arguments', () => {
      const token = buildToken('type', 'lexeme');
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe('lexeme');
      expect(token.toString()).toBe(tokenToString(token));
    });

    it('object argument with type attribute', () => {
      const token = buildToken({ type: 'type' });
      expect(token.type).toBe('type');
      expect(token.lexeme).toBeUndefined();
      expect(token.toString()).toBe(tokenToString(token));
    });

    it('object argument with type and lexeme attributes', () => {
      const token = buildToken({ type: 'type', lexeme: 'lexeme' });
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe('lexeme');
      expect(token.toString()).toBe(tokenToString(token));
    });

    it('throw error once called with no arguments', () => {
      expect(() => buildToken()).toThrow(
        'buildToken must have at least one argument'
      );
    });

    it('throw error once called with wrong arguments', () => {
      expect(() => buildToken(1)).toThrow('buildToken has no valid argument');
    });

    it('throw error once called with a second invalid argument', () => {
      const errorMessage =
        'buildToken invalid second parameter [ accepts: string | number | undefined ]';

      expect(() => buildToken('type', null)).toThrow(errorMessage);
      expect(() => buildToken('type', {})).toThrow(errorMessage);
      expect(() => buildToken('type', /hello/i)).toThrow(errorMessage);
      expect(() => buildToken('type', () => {})).toThrow(errorMessage);
    });
  });

  describe('regexp specs', () => {
    regexpIt({
      name: 'Element',
      regexp: Spec.Element[0],
      input:
        '<greetings attr1="1" attr2=\'2\' required>Hello World</greetings>',
      check: (result) => {
        expect(result).not.toBeNull();

        const { groups } = result!;
        expect(groups).toBeDefined();

        expect(groups!['tag']).toBe('greetings');
        expect(groups!['attributes']).toBe(` attr1="1" attr2='2' required`);
        expect(groups!['content']).toBe('Hello World');
      },
    });

    regexpIt({
      name: 'EmptySpaces',
      regexp: Spec.EmptySpaces[0],
      input: ' \n\t\r\n       \n\t\r     ',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe(' ');
      },
    });

    regexpIt({
      name: 'Comment',
      regexp: Spec.Comment[0],
      input: '<!-- comment -->',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('<!-- comment -->');
      },
    });

    describe('DTD', () => {
      regexpIt({
        name: 'single line',
        regexp: Spec.DTD[0],
        input: `<!DOCTYPE book SYSTEM "book.dtd">`,
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe(`<!DOCTYPE book SYSTEM "book.dtd">`);
        },
      });

      regexpIt({
        name: 'html5',
        regexp: Spec.DTD[0],
        input: `<!DOCTYPE html>`,
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe(`<!DOCTYPE html>`);
        },
      });

      regexpIt({
        name: 'complex',
        regexp: Spec.DTD[0],
        input: `<!DOCTYPE book [  
    <!ELEMENT book (title,author,publisher)>
    <!ELEMENT title(#PCDATA)>
    <!ELEMENT author (#PCDATA)>
    <!ELEMENT publisher(#PCDATA)>
  ]>`,
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe(`<!DOCTYPE book [  
    <!ELEMENT book (title,author,publisher)>
    <!ELEMENT title(#PCDATA)>
    <!ELEMENT author (#PCDATA)>
    <!ELEMENT publisher(#PCDATA)>
  ]>`);
        },
      });
    });

    regexpIt({
      name: 'ExternalStyleSheets',
      regexp: Spec.ExternalStyleSheets[0],
      input: '<?xml-stylesheet type="text/xsl" href="style.xsl"?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe(
          '<?xml-stylesheet type="text/xsl" href="style.xsl"?>'
        );
      },
    });

    regexpIt({
      name: 'XmlDeclStart',
      regexp: Spec.XmlDeclStart[0],
      input: '<?xml version="1.0"?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('<?xml');
      },
    });

    // SpecialClose
    regexpIt({
      name: 'SpecialClose',
      regexp: Spec.SpecialClose[0],
      input: '?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('?>');
      },
    });

    // Name
    describe('Name', () => {
      regexpIt({
        name: 'simple name',
        regexp: Spec.Name[0],
        input: 'hello',
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe('hello');
        },
      });

      regexpIt({
        name: 'snake case name',
        regexp: Spec.Name[0],
        input: 'hello-world',
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe('hello-world');
        },
      });

      regexpIt({
        name: 'snake case name + namespace',
        regexp: Spec.Name[0],
        input: 'ns:hello-world',
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe('ns:hello-world');
        },
      });
    });

    describe('String', () => {
      regexpIt({
        name: 'single quoted string',
        regexp: Spec.String[0],
        input: `'hello world'`,
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe(`'hello world'`);
        },
      });

      regexpIt({
        name: 'double quoted string',
        regexp: Spec.String[0],
        input: `"hello world"`,
        check: (result) => {
          expect(result).not.toBeNull();
          expect(result![0]).toBe(`"hello world"`);
        },
      });
    });

    regexpIt({
      name: 'CData',
      regexp: Spec.CData[0],
      input: '<![CDATA[cdata]]>',
      check: (result) => {
        expect(result).toBeDefined();
        expect(result![0]).toBe('<![CDATA[cdata]]>');
        expect(result![1]).toBe('cdata');
        const groups = result!.groups;
        expect(groups).toBeDefined();
        expect(groups!['raw']).toBe('cdata');
      },
    });

    regexpIt({
      name: 'Text',
      regexp: Spec.Text[0],
      input: 'Hello World</greetings>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('Hello World');

        console.log(result);
      },
    });

    regexpIt({
      name: 'RawText',
      regexp: Spec.RawText[0],
      input: `dasd>%%$&&&&&<asdasdasdas$$%%^^^</`,
      check: (result) => {
        expect(result).not.toBeNull();
        const expectedStr = `dasd>%%$&&&&&<asdasdasdas$$%%^^^`;
        expect(result![0]).toBe(`${expectedStr}</`);
        expect(result![1]).toBe(expectedStr);

        const groups = result!.groups;
        expect(groups).toBeDefined();
        expect(groups!['raw']).toBe(expectedStr);
      },
    });

    regexpIt({
      name: 'Open',
      regexp: Spec.Open[0],
      input: '<greetings>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('<');
      },
    });

    regexpIt({
      name: 'Close',
      regexp: Spec.Close[0],
      input: '>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('>');
      },
    });

    regexpIt({
      name: 'Slash',
      regexp: Spec.Slash[0],
      input: '/',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('/');
      },
    });

    regexpIt({
      name: 'Equals',
      regexp: Spec.Equals[0],
      input: '=',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('=');
      },
    });
  });
});
