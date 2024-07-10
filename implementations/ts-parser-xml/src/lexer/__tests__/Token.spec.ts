import { Token, tokenToString, buildToken, Spec } from '~/lexer/Token';

import { regexpIt, namedRegexpIt } from './_helpers';

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

  describe('long lexeme - lorem ipsum', () => {
    it('default maxLexemeLength = 50', () => {
      const lexeme = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt.`;
      const token = new Token('type', lexeme);
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe(lexeme);
      expect(token.toString()).toBe(tokenToString(token));
    });

    it('maxLexemeLength = 25', () => {
      const maxLexemeLength = 25;
      const lexeme = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt.`;
      const token = new Token('type', lexeme);
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe(lexeme);
      expect(token.toString(maxLexemeLength)).toBe(
        tokenToString(token, maxLexemeLength)
      );
    });
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
    namedRegexpIt({
      name: 'Element',
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

    namedRegexpIt({
      name: 'EndOfLine',
      input: '\n',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('\n');
      },
    });

    namedRegexpIt({
      name: 'EmptySpaces',
      input: ' \n\t\r\n       \n\t\r     ',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe(' ');
      },
    });

    namedRegexpIt({
      name: 'Comment',
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

    namedRegexpIt({
      name: 'ExternalStyleSheets',
      input: '<?xml-stylesheet type="text/xsl" href="style.xsl"?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe(
          '<?xml-stylesheet type="text/xsl" href="style.xsl"?>'
        );
      },
    });

    namedRegexpIt({
      name: 'XmlDeclStart',
      input: '<?xml version="1.0"?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('<?xml');
      },
    });

    namedRegexpIt({
      name: 'SpecialClose',
      input: '?>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('?>');
      },
    });

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

    namedRegexpIt({
      name: 'CData',
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

    namedRegexpIt({
      name: 'Text',
      input: 'Hello World</greetings>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('Hello World');
      },
    });

    namedRegexpIt({
      name: 'RawText',
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

    namedRegexpIt({
      name: 'Open',
      input: '<greetings>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('<');
      },
    });

    namedRegexpIt({
      name: 'Close',
      input: '>',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('>');
      },
    });

    namedRegexpIt({
      name: 'Slash',
      input: '/',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('/');
      },
    });

    namedRegexpIt({
      name: 'Equals',
      input: '=',
      check: (result) => {
        expect(result).not.toBeNull();
        expect(result![0]).toBe('=');
      },
    });
  });
});
