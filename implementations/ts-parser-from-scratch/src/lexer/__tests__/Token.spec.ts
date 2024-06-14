import { Token, buildTokenString, buildToken } from '~/lexer/Token';

describe('Token', () => {
  it('buildTokenString', () => {
    expect(buildTokenString(new Token('type'))).toBe('Token( type )');
    expect(buildTokenString(new Token('type', 'lexeme'))).toBe(
      'Token( type, lexeme )'
    );
  });

  it('new Token', () => {
    let token = new Token('type');
    expect(token.type).toBe('type');
    expect(token.lexeme).toBeUndefined();
    expect(token.toString()).toBe(buildTokenString(token));

    token = new Token('type', 'lexeme');
    expect(token.type).toBe('type');
    expect(token.lexeme).toBe('lexeme');
    expect(token.toString()).toBe(buildTokenString(token));
  });

  describe('buildToken', () => {
    it('one argument', () => {
      const token = buildToken('type');
      expect(token.type).toBe('type');
      expect(token.lexeme).toBeUndefined();
      expect(token.toString()).toBe(buildTokenString(token));
    });

    it('two arguments', () => {
      const token = buildToken('type', 'lexeme');
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe('lexeme');
      expect(token.toString()).toBe(buildTokenString(token));
    });

    it('object argument with type attribute', () => {
      const token = buildToken({ type: 'type' });
      expect(token.type).toBe('type');
      expect(token.lexeme).toBeUndefined();
      expect(token.toString()).toBe(buildTokenString(token));
    });

    it('object argument with type and lexeme attributes', () => {
      const token = buildToken({ type: 'type', lexeme: 'lexeme' });
      expect(token.type).toBe('type');
      expect(token.lexeme).toBe('lexeme');
      expect(token.toString()).toBe(buildTokenString(token));
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
});
