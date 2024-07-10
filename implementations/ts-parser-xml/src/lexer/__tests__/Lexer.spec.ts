import { Lexer, TokenTypes } from '~/lexer';

describe('Lexer', () => {
  it.skip('no source', () => {
    const lexer = new Lexer();
    expect(lexer.getNextToken()).toMatchObject({
      type: TokenTypes.EOF,
    });
  });

  it('throw unexpected token', () => {
    const ErrorRegexp = /^Unexpected token: "/;
    const lexer = new Lexer();

    lexer.init('\n\ts####', false);
    expect(() => lexer.getNextToken()).toThrow(ErrorRegexp);
  });

  // TODO: define more test cases
});
