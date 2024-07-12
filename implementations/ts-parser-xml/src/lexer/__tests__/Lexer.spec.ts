import { Lexer, TokenTypes, TokenSpecs } from '~/lexer';

describe('Lexer', () => {
  it('EOF - end of file', () => {
    const lexer = new Lexer();
    expect(lexer.getNextToken()).toMatchObject({
      type: TokenTypes.EOF,
    });
  });

  it('Unexpected token', () => {
    const ErrorRegexp = /^Unexpected token @/;
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

      expect(lexer.getNextToken(TokenSpecs.TagDecl)).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });

    it('/', () => {
      const lexer = new Lexer();

      const lexeme = '/';

      lexer.init(lexeme, false);
      lexer.setSpecs(TokenSpecs.TagDecl);

      expect(lexer.getNextToken()).toMatchObject({
        type: lexeme,
        lexeme,
      });
    });

    it('=', () => {
      const lexer = new Lexer();

      const lexeme = '=';

      lexer.init(lexeme, true, TokenSpecs.TagDecl);

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

  describe('text', () => {
    it('text token after close the tag declaration token', () => {
      const lexer = new Lexer();

      const input = '>some content that should be present indide of a tag';

      lexer.init(input, false);

      expect(lexer.getNextToken(TokenSpecs.TagDecl)).toMatchObject({
        type: '>',
        line: 1,
        column: 1,
      });

      expect(lexer.getNextToken(TokenSpecs.TagContent)).toMatchObject({
        type: TokenTypes.TEXT,
        line: 1,
        column: 2,
      });
    });

    it('the next token is the text token', () => {
      const lexer = new Lexer();

      const input = 'some content that should be present indide of a tag';

      lexer.init(input, false);

      expect(lexer.getNextToken(TokenSpecs.TagContent)).toMatchObject({
        type: TokenTypes.TEXT,
        line: 1,
        column: 1,
      });
    });

    it('text token until next open tag declaration token', () => {
      const lexer = new Lexer();

      const input = 'some content that should <br> be present indide of a tag';

      lexer.init(input, false);

      expect(lexer.getNextToken(TokenSpecs.TagContent)).toMatchObject({
        type: TokenTypes.TEXT,
        lexeme: 'some content that should ',
        line: 1,
        column: 1,
      });
    });

    it('tag between text tokens', () => {
      const lexer = new Lexer();

      const input = 'some content that should <br> be present indide of a tag';

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.TagContent);
      expect(token).toMatchObject({
        type: TokenTypes.TEXT,
        lexeme: 'some content that should ',
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '<',
        lexeme: '<',
        line: 1,
        column: 26,
      });

      token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: 'NAME',
        lexeme: 'br',
        line: 1,
        column: 27,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '>',
        lexeme: '>',
        line: 1,
        column: 29,
      });

      token = lexer.getNextToken(TokenSpecs.TagContent);
      expect(token).toMatchObject({
        type: TokenTypes.TEXT,
        lexeme: 'be present indide of a tag',
        line: 1,
        column: 31,
      });
    });
  });

  describe('CData', () => {
    it('single line content', () => {
      const lexer = new Lexer();

      const input = '<![CDATA[hello world]]>';

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.TagContent);
      expect(token).toMatchObject({
        type: TokenTypes.CDATA,
        lexeme: input,
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 1,
        column: 24,
      });
    });

    it('multiple lines content', () => {
      const lexer = new Lexer();

      const input = `<![CDATA[hello

world

!]]>`;

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.TagContent);
      expect(token).toMatchObject({
        type: TokenTypes.CDATA,
        lexeme: input,
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 5,
        column: 5,
      });
    });

    it('as tag content', () => {
      const lexer = new Lexer();

      const content = `<![CDATA[hello
      
world

!]]>`;
      const input = `>${content}<`;

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: '>',
        lexeme: '>',
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken(TokenSpecs.TagContent);
      expect(token).toMatchObject({
        type: TokenTypes.CDATA,
        lexeme: content,
        line: 1,
        column: 2,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '<',
        lexeme: '<',
        line: 5,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 5,
        column: 2,
      });
    });
  });

  describe('raw text', () => {
    it('single line content', () => {
      const lexer = new Lexer();

      const content = `? any text ?!@#$=[]/\t$%&^*()\\!±#%^ "'\``;
      const input = `${content}</`;

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.SpecialTag);
      expect(token).toMatchObject({
        type: TokenTypes.RAW_TEXT,
        lexeme: content,
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '<',
        lexeme: '<',
        line: 1,
        column: 41,
      });

      token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: '/',
        lexeme: '/',
        line: 1,
        column: 42,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 1,
        column: 43,
      });
    });

    it('multiple lines content', () => {
      const lexer = new Lexer();

      const content = `? any text ?!@#$=[]/\n\t\r\n$%&^*()\\!±#%^ "'\``;
      const input = `${content}</`;

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.SpecialTag);
      expect(token).toMatchObject({
        type: TokenTypes.RAW_TEXT,
        lexeme: content,
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '<',
        lexeme: '<',
        line: 3,
        column: 20,
      });

      token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: '/',
        lexeme: '/',
        line: 3,
        column: 21,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 3,
        column: 22,
      });
    });

    it('as tag content', () => {
      const lexer = new Lexer();

      const content = `? any text ?!@#$=[]/\n\t\r\n$%&^*()\\!±#%^ "'\``;
      const input = `>${content}</`;

      lexer.init(input, false);

      let token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: '>',
        lexeme: '>',
        line: 1,
        column: 1,
      });

      token = lexer.getNextToken(TokenSpecs.SpecialTag);
      expect(token).toMatchObject({
        type: TokenTypes.RAW_TEXT,
        lexeme: content,
        line: 1,
        column: 2,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: '<',
        lexeme: '<',
        line: 3,
        column: 20,
      });

      token = lexer.getNextToken(TokenSpecs.TagDecl);
      expect(token).toMatchObject({
        type: '/',
        lexeme: '/',
        line: 3,
        column: 21,
      });

      token = lexer.getNextToken();
      expect(token).toMatchObject({
        type: TokenTypes.EOF,
        line: 3,
        column: 22,
      });
    });
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
      const ErrorRegexp = /^Unexpected end of input @\[/;
      const lexer = new Lexer();

      lexer.init('', true, TokenSpecs.TagDecl);
      expect(() => lexer.eatToken(TokenTypes.SPECIAL_CLOSE)).toThrow(
        ErrorRegexp
      );
    });

    it('Unexpected token', () => {
      const ErrorRegexp = /^Unexpected token type @\[/;
      const lexer = new Lexer();

      lexer.init('>', true, TokenSpecs.TagDecl);
      expect(() => lexer.eatToken('<')).toThrow(ErrorRegexp);
    });
  });
});
