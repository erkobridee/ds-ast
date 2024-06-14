import type { IToken } from './Token';
import { buildToken } from './Token';

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
   * @returns {boolean} true if the end of the source has been reached
   */
  private isEOF() {
    return this.cursor === this.source.length;
  }

  /**
   *
   * @returns {boolean} true if there are more tokens
   */
  private hasMoreTokens() {
    return this.cursor < this.source.length;
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

    const string = this.source.slice(this.cursor);

    // Numbers:
    if (!Number.isNaN(Number(string[0]))) {
      let n = '';

      while (!Number.isNaN(Number(string[this.cursor]))) {
        n += string[this.cursor++];
      }

      return buildToken('NUMBER', n);
    }

    // Strings:
    if (string[0] === `"`) {
      let s = '';
      do {
        s += string[this.cursor++];
      } while (string[this.cursor] !== `"` && !this.isEOF());
      s += string[this.cursor++];
      return buildToken('STRING', s);
    }

    if (string[0] === `'`) {
      let s = '';
      do {
        s += string[this.cursor++];
      } while (string[this.cursor] !== `'` && !this.isEOF());
      s += string[this.cursor++];
      return buildToken('STRING', s);
    }

    return null;
  }
}

export default Lexer;
