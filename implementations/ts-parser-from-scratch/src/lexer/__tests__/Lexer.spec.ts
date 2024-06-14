import { Lexer, TokenTypes } from '~/lexer';

describe('Lexer', () => {
  it('no source', () => {
    const lexer = new Lexer();
    expect(lexer.getNextToken()).toBeNull();
  });

  it('numbers', () => {
    const type = TokenTypes.NUMBER;
    const lexer = new Lexer();

    lexer.init('0');
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: '0' });

    lexer.init('01');
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '01',
    });

    lexer.init('42');
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '42',
    });

    lexer.init('1337');
    expect(lexer.getNextToken()).toMatchObject({
      type,
      lexeme: '1337',
    });
  });

  it('strings', () => {
    const type = TokenTypes.STRING;
    const lexer = new Lexer();

    lexer.init(`''`);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `''` });

    lexer.init(`""`);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `""` });

    lexer.init(`" 42 "`);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `" 42 "` });

    lexer.init(`'4 2'`);
    expect(lexer.getNextToken()).toMatchObject({ type, lexeme: `'4 2'` });
  });
});
