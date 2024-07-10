import { Lexer, TokenTypes, TagSpecs } from '~/lexer';

describe('Lexer', () => {
  it('EOF - end of file', () => {
    const lexer = new Lexer();
    expect(lexer.getNextToken()).toMatchObject({
      type: TokenTypes.EOF,
    });
  });

  it('Unexpected token', () => {
    const ErrorRegexp = /^Unexpected token: "/;
    const lexer = new Lexer();

    lexer.init('\n\ts####', false);
    expect(() => lexer.getNextToken()).toThrow(ErrorRegexp);
  });

  describe('does not create a specific token for', () => {
    it('EOL - end of line', () => {
      const lexer = new Lexer();

      const input = '\n\r\n';

      lexer.init(input, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
        line: 3,
        column: 1,
      });
    });

    it('Empty Space', () => {
      const lexer = new Lexer();

      const input = ' \t  \t\t   ';

      lexer.init(input, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
        line: 1,
        column: 10,
      });
    });

    it('Comment', () => {
      const lexer = new Lexer();

      lexer.init('<!-- hello world -->', false);
      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
      });

      lexer.init(
        `<!-- 
  hello 
    world 
      -->`,
        false
      );

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
        line: 4,
        column: 10,
      });
    });

    it('XML StyleSheet', () => {
      const lexer = new Lexer();

      lexer.init(`<?xml-stylesheet href="my-style.css"?>`, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
        line: 1,
        column: 39,
      });

      lexer.init(
        `<?xml-stylesheet 
        href="my-style.css" 
?>`,
        false
      );

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.EOF,
        line: 3,
        column: 3,
      });
    });

    describe('DTD', () => {
      it('html v5', () => {
        const input = `<!DOCTYPE html>`;

        const lexer = new Lexer();
        lexer.init(input, false);

        expect(lexer.getNextToken()).toMatchObject({
          type: TokenTypes.EOF,
          line: 1,
          column: 16,
        });
      });

      it('html v4', () => {
        const input = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`;

        const lexer = new Lexer();
        lexer.init(input, false);

        expect(lexer.getNextToken()).toMatchObject({
          type: TokenTypes.EOF,
          line: 1,
          column: 91,
        });
      });

      it('xml book system', () => {
        const input = `<!DOCTYPE book SYSTEM "book.dtd">`;

        const lexer = new Lexer();
        lexer.init(input, false);

        expect(lexer.getNextToken()).toMatchObject({
          type: TokenTypes.EOF,
          line: 1,
          column: 34,
        });
      });

      it('xml book declaration', () => {
        const input = `<!DOCTYPE book [  
	<!ELEMENT book (title,author,publisher)>
	<!ELEMENT title(#PCDATA)>
	<!ELEMENT author (#PCDATA)>
	<!ELEMENT publisher(#PCDATA)>
]>`;

        const lexer = new Lexer();
        lexer.init(input, false);

        expect(lexer.getNextToken()).toMatchObject({
          type: TokenTypes.EOF,
          line: 6,
          column: 3,
        });
      });
    });
  });

  describe('supported symbols', () => {
    it('<', () => {
      const lexer = new Lexer();

      const lexeme = '<';

      lexer.init(lexeme, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });

    it('>', () => {
      const lexer = new Lexer();

      const lexeme = '>';

      lexer.init(lexeme, false);

      expect(lexer.getNextToken(TagSpecs)).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });

    it('/', () => {
      const lexer = new Lexer();

      const lexeme = '/';

      lexer.init(lexeme, false);
      lexer.setSpecs(TagSpecs);

      expect(lexer.getNextToken()).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });

    it('=', () => {
      const lexer = new Lexer();

      const lexeme = '=';

      lexer.init(lexeme, true, TagSpecs);

      expect(lexer.eatToken(lexeme)).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });
  });

  describe('xml declaration', () => {
    it('<?xml - XML_DECL_START', () => {
      const lexer = new Lexer();

      const lexeme = '<?xml';

      lexer.init(lexeme, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.XML_DECL_START,
        lexeme,
      });
    });

    it('?> - SPECIAL_CLOSE', () => {
      const lexer = new Lexer();

      const lexeme = '?>';

      lexer.init(lexeme, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.SPECIAL_CLOSE,
        lexeme,
      });
    });

    it('attribute name', () => {
      const lexer = new Lexer();

      const lexeme = 'encoding';

      lexer.init(`${lexeme}="UTF-8"`, false);

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.NAME,
        lexeme,
      });
    });

    it('attribute value', () => {
      const lexer = new Lexer();

      const lexeme = '"UTF-8"';

      lexer.init(`encoding=${lexeme}`, false);

      // attribute name
      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.NAME,
        lexeme: 'encoding',
        line: 1,
        column: 1,
      });

      // =
      expect(lexer.getNextToken()).toMatchObject({
        type: '=',
        lexeme: '=',
        line: 1,
        column: 9,
      });

      expect(lexer.getNextToken()).toMatchObject({
        type: TokenTypes.STRING,
        lexeme,
        line: 1,
        column: 10,
      });
    });
  });

  it.skip('text', () => {
    // TODO: define the test
  });

  it.skip('raw text', () => {
    // TODO: define the test
  });

  it.skip('CData', () => {
    // TODO: define the test
  });

  describe('eat tokens', () => {
    it('xml declaration', () => {
      const lexer = new Lexer();

      lexer.init(`<?xml version="1.0" encoding="UTF-8"?>`);

      [
        [TokenTypes.XML_DECL_START, '<?xml'],
        [TokenTypes.NAME, 'version'],
        ['=', '='],
        [TokenTypes.STRING, '"1.0"'],
        [TokenTypes.NAME, 'encoding'],
        ['=', '='],
        [TokenTypes.STRING, '"UTF-8"'],
        [TokenTypes.SPECIAL_CLOSE, '?>'],
      ].forEach(([type, lexeme]) => {
        expect(lexer.eatToken(type)).toMatchObject({
          type,
          lexeme,
        });
      });
    });

    it('Unexpected end of input', () => {
      const ErrorRegexp = /^Unexpected end of input/;
      const lexer = new Lexer();

      lexer.init('', true, TagSpecs);
      expect(() => lexer.eatToken(TokenTypes.SPECIAL_CLOSE)).toThrow(
        ErrorRegexp
      );
    });

    it('Unexpected token', () => {
      const ErrorRegexp = /^Unexpected "/;
      const lexer = new Lexer();

      lexer.init('>', true, TagSpecs);
      expect(() => lexer.eatToken('<')).toThrow(ErrorRegexp);
    });
  });
});
