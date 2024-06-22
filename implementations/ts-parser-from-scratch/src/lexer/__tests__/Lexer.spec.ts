import { Lexer, TokenTypes } from '~/lexer';

describe('Lexer', () => {
  it('no source', () => {
    const lexer = new Lexer();
    expect(lexer.getNextToken()).toMatchObject({
      type: TokenTypes.EOF,
    });
  });

  it('throw unexpected token', () => {
    const ErrorRegexp = /^Unexpected token: "/;
    const lexer = new Lexer();

    lexer.init('test', false);
    expect(() => lexer.getNextToken()).toThrow(ErrorRegexp);

    lexer.init('123a', false);
    expect(lexer.getNextToken()).toMatchObject({
      type: TokenTypes.NUMBER,
      lexeme: '123',
    });
    expect(() => lexer.getNextToken()).toThrow(ErrorRegexp);
  });

  it('numbers', () => {
    const type = TokenTypes.NUMBER;
    const lexer = new Lexer();

    lexer.init('0', false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: '0' });

    lexer.init('01', false);
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '01',
    });

    lexer.init('42', false);
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '42',
    });

    lexer.init(
      `
      
      // Number:
      42

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '42',
    });

    lexer.init(
      `
      
      /**
        Multi line comment
       */
      42

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '42',
    });

    lexer.init(
      `
      
      /**
       * Multi line comment documentation
       */
      42

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '42',
    });

    lexer.init('1337', false);
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '1337',
    });

    lexer.init('  1337 ', false);
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '1337',
    });
  });

  it('strings', () => {
    const type = TokenTypes.STRING;
    const lexer = new Lexer();

    lexer.init(`''`, false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `''` });

    lexer.init(`""`, false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `""` });

    lexer.init(`" 42 "`, false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `" 42 "` });

    lexer.init(`'4 2'`, false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `'4 2'` });

    lexer.init(` '4 2' `, false);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `'4 2'` });

    lexer.init(
      `

      // String:
      "Single line comment"

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: `"Single line comment"`,
    });

    lexer.init(
      `

      /**
        Multi line comment
       */
      "Multi line comment"

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: `"Multi line comment"`,
    });

    lexer.init(
      `

      /**
       * Multi line comment documentation
       */
      "Multi line comment documentation"

    `,
      false
    );
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: `"Multi line comment documentation"`,
    });
  });
});
