import type { IToken, TSpec } from './Token';
import { buildToken, PrologSpecs, Types, buildEOFToken } from './Token';

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
  private specs: TSpec[] = [];

  /**
   * Initializes the lexer
   */
  public init(source = '', shouldLookahead = true, specsToUse = PrologSpecs) {
    this.source = source;
    this.cursor = 0;
    this.specs = specsToUse;

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

  private matchHelper(
    regexp: RegExp,
    strToCheck: string,
    tokenType: string | null
  ) {
    const matched = regexp.exec(strToCheck);

    if (matched === null) {
      return null;
    }

    let tokenLexeme = matched[0];

    switch (tokenType) {
      case Types.CDATA:
      case Types.RAW_TEXT:
        tokenLexeme = matched[1];
        break;
    }

    this.cursor += tokenLexeme.length;
    return tokenLexeme;
  }

  /**
   * Obtains the next token
   *
   *
   * current implementation: manual state machine
   *
   * supports: Numbers and Strings
   *
   * @param {TSpec[]} specsToUse - optional
   * @returns {IToken}
   */
  public getNextToken(specsToUse?: TSpec[]): IToken {
    if (!this.hasMoreTokens()) {
      return buildEOFToken();
    }

    if (specsToUse) {
      this.specs = specsToUse;
    }

    const strToCheck = this.source.slice(this.cursor);

    for (const [regexp, tokenType] of this.specs) {
      const tokenLexeme = this.matchHelper(regexp, strToCheck, tokenType);

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
   * @param {TSpec[]} specsToUse - optional
   * @returns {IToken} the expected token
   */
  public eatToken(tokenType: string, specsToUse?: TSpec[]) {
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
    this.lookahead = this.getNextToken(specsToUse);

    return token;
  }
}

export default Lexer;
