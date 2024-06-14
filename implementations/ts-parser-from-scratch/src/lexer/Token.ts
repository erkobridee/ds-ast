import { isObject, isString, isNumber, isUndefined } from '~/utils/check';

export interface IToken {
  type: string;
  lexeme?: string;
}

//----------------------------------------------------------------------------//

export const buildTokenString = (token: IToken): string => {
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
    return buildTokenString(this);
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
  SKIP: null,

  NUMBER: 'NUMBER',
  STRING: 'STRING',
} as const;

//----------------------------------------------------------------------------//

export const Specs = [
  //----------------------------------------------------------------------------
  // Whitespace

  [/^\s+/, Types.SKIP],

  //----------------------------------------------------------------------------
  // Numbers

  [/^\d+/, Types.NUMBER],

  //----------------------------------------------------------------------------
  // Strings

  // "" or ''
  [/("[^"]*")|('[^']*')/, Types.STRING],
] as const;

//----------------------------------------------------------------------------//

export default Token;
