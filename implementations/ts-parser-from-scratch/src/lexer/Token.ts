import { isObject, isString, isNumber, isUndefined } from '~/utils/check';

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

const isSecondInvalid = (value: unknown) =>
  !(isString(value) || isNumber(value) || isUndefined(value));

export const buildToken = (...args: unknown[]) => {
  if (args.length === 0) {
    throw new BuildTokenError('buildToken must have at least one argument');
  }

  const [first, second] = args;

  if (isObject(first)) {
    const { type, lexeme } = first as IToken;
    return new Token(type, lexeme);
  }

  if (isString(first)) {
    if (isSecondInvalid(second)) {
      throw new BuildTokenError(
        'buildToken invalid second parameter [ accepts: string | number | undefined ]'
      );
    }

    return new Token(
      first as string,
      isString(second) ? (second as string) : undefined
    );
  }

  throw new BuildTokenError('buildToken has no valid argument');
};

//----------------------------------------------------------------------------//

export const Types = {
  EOF: 'EOF',

  SKIP: null,

  ADDITIVE_OPERATOR: 'ADDITIVE_OPERATOR',
  MULTIPLICATIVE_OPERATOR: 'MULTIPLICATIVE_OPERATOR',

  NUMBER: 'NUMBER',
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

  //----------------------------------------------------------------------------
  // Symbols, delimiters
  //
  // since them are single characters, we can use their definition directly

  [/^;/, ';'],
  [/^{/, '{'],
  [/^}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],

  //----------------------------------------------------------------------------
  // Math operators: +, -, *, /

  [/^[+\-]/, Types.ADDITIVE_OPERATOR],
  [/^[*\/]/, Types.MULTIPLICATIVE_OPERATOR],

  //----------------------------------------------------------------------------
  // Numbers

  [/^\d+/, Types.NUMBER],

  //----------------------------------------------------------------------------
  // Strings

  // "" or ''
  [/^("[^"]*")|('[^']*')/, Types.STRING],
] as const;

//----------------------------------------------------------------------------//

export default Token;
