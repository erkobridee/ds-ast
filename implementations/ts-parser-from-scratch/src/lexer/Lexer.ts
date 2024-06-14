import type { IToken } from './Token';
import { buildToken, Specs as TokenSpecs } from './Token';

//----------------------------------------------------------------------------//

/**
 * Tokenizer logic.
 *
 * Lazily pulls a token from a source string.
 */
export class Lexer {
  private source = '';
  private cursor = 0;

  /**
   * Initializes the lexer
   */
  public init(source = '') {
    this.source = source;
    this.cursor = 0;
  }

  constructor(source = '') {
    this.init(source);
  }

  /**
   *
   * @returns {boolean} true if there are more tokens
   */
  private hasMoreTokens() {
    return this.cursor < this.source.length;
  }

  private matchHelper(regexp: RegExp, strToCheck: string) {
    const matched = regexp.exec(strToCheck);

    if (matched === null) {
      return null;
    }

    this.cursor += matched[0].length;
    return matched[0];
  }

  /**
   * Obtains the next token
   *
   *
   * current implementation: manual state machine
   *
   * supports: Numbers and Strings
   */
  public getNextToken(): IToken | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const strToCheck = this.source.slice(this.cursor);

    for (const [regexp, tokenType] of TokenSpecs) {
      const tokenLexeme = this.matchHelper(regexp, strToCheck);

      if (tokenLexeme === null) {
        continue;
      }

      return buildToken(tokenType, tokenLexeme);
    }

    throw new SyntaxError(`Unexpected token: "${strToCheck[0]}"`);
  }
}

export default Lexer;
