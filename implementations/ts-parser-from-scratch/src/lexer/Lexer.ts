import type { IToken } from './Token';
import { buildToken, Specs as TokenSpecs, Types, buildEOFToken } from './Token';

//----------------------------------------------------------------------------//

/**
 * Tokenizer logic.
 *
 * Lazily pulls a token from a source string.
 */
export class Lexer {
  private source = '';
  private cursor = 0;
  private lookahead: IToken = buildEOFToken();

  /**
   * Initializes the lexer
   */
  public init(source = '', shouldLookahead = true) {
    this.source = source;
    this.cursor = 0;

    /*
      Prime the tokenizer to obtain the first token
      which is our lookahead.

      The lookahead is used for predictive parsing.
    */
    if (shouldLookahead) this.lookahead = this.getNextToken();

    return this.lookahead;
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
  public getNextToken(): IToken {
    if (!this.hasMoreTokens()) {
      return buildEOFToken();
    }

    const strToCheck = this.source.slice(this.cursor);

    for (const [regexp, tokenType] of TokenSpecs) {
      const tokenLexeme = this.matchHelper(regexp, strToCheck);

      if (tokenLexeme === null) {
        continue;
      }

      // should skip token, e.g. whitespace
      if (tokenType === Types.SKIP) {
        return this.getNextToken();
      }

      return buildToken(tokenType, tokenLexeme);
    }

    throw new SyntaxError(`Unexpected token: "${strToCheck[0]}"`);
  }

  /**
   * Retrieve the lookahed token type
   *
   * @returns {string} the type of the next token
   */
  public getLookaheadTokenType() {
    return this.lookahead?.type;
  }

  /**
   * Expects a token of a given type
   *
   * @param {string} tokenType
   * @returns {IToken} the expected token
   */
  public eatToken(tokenType: string) {
    const token = this.lookahead;

    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected "${token.type}", expected: "${tokenType}"`
      );
    }

    // Advance to the next token
    this.lookahead = this.getNextToken();

    return token;
  }
}

export default Lexer;
