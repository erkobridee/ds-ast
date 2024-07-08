export interface IToken {
  type: string;
  lexeme?: string;
}

//----------------------------------------------------------------------------//

export const tokenToString = (token: IToken): string => {
  const { type, lexeme } = token;

  return `Token( ${type}` + (lexeme ? `, ${lexeme}` : '') + ' )';
};

export class Token implements IToken {
  public type: string;
  public lexeme?: string;

  constructor(type: string, lexeme?: string) {
    this.type = type;
    this.lexeme = lexeme;
  }

  public toString(): string {
    return tokenToString(this);
  }
}

//----------------------------------------------------------------------------//

export class BuildTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuildTokenError';
  }
}

//----------------------------------------------------------------------------//

export const Types = {
  EOF: 'EOF',

  SKIP: null,

  // TODO: update the types

  // TODO: review this definition
  STRING: 'STRING',
} as const;

// EOF - End of File
export const buildEOFToken = () => new Token(Types.EOF);

//----------------------------------------------------------------------------//

export const Specs = [
  //----------------------------------------------------------------------------
  // Whitespace

  [/^\s+/, Types.SKIP],

  //----------------------------------------------------------------------------
  // Comments

  // single line comment
  [/^\/\/.*/, Types.SKIP],

  // multi line comment
  [/^\/\*[\s\S]*?\*\//, Types.SKIP],

  // TODO: define the xml comment type

  //----------------------------------------------------------------------------
  // Symbols, delimiters
  //
  // since them are single characters, we can use their definition directly

  // TODO: review

  [/^;/, ';'],
  [/^{/, '{'],
  [/^}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],

  //----------------------------------------------------------------------------
  // Strings

  // "" or ''
  [/^("[^"]*")|('[^']*')/, Types.STRING],
] as const;

//----------------------------------------------------------------------------//

export default Token;
