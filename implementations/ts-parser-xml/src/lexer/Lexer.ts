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

  private line = 1;
  private column = 1;

  private lookahead: IToken = buildEOFToken();
  private specs: TSpec[] = [];

  /**
   * Initializes the lexer
   */
  public init(source = '', shouldLookahead = true, specsToUse = PrologSpecs) {
    this.source = source;
    this.cursor = 0;

    this.line = 1;
    this.column = 1;

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
    source && this.init(source);
  }

  /**
   *
   * @returns {boolean} true if there are more tokens
   */
  private hasMoreTokens() {
    return this.cursor < this.source.length;
  }

  //--------------------------------------------------------------------------//

  private getMatchedIndex(tokenType: string | null) {
    switch (tokenType) {
      case Types.CDATA:
      case Types.RAW_TEXT:
        return 1;
      default:
        return 0;
    }
  }

  private matchHelper(regexp: RegExp, strToCheck: string, matchedIndex = 0) {
    const matched = regexp.exec(strToCheck);

    if (matched === null) {
      return null;
    }

    const tokenLexeme = matched[matchedIndex];
    this.cursor += tokenLexeme.length;
    return tokenLexeme;
  }

  //--------------------------------------------------------------------------//

  private runTokenAction(tokenType: string | null, tokenLexeme: string) {
    const previousLine = this.line;
    const previousColumn = this.column;

    switch (tokenType) {
      case Types.EOL:
        this.line += 1;
        this.column = 1;
        break;

      case Types.DTD:
      case Types.CDATA:
      case Types.COMMENT:
      case Types.RAW_TEXT:
      case Types.EXTERNAL_STYLE_SHEETS:
        const tokenLexemeLines = tokenLexeme.split('\n');
        const linesNumber = tokenLexemeLines.length;

        this.line += linesNumber - 1;

        if (this.hasMoreTokens()) {
          this.column = 1;
        } else {
          this.column = tokenLexemeLines[linesNumber - 1].length + 1;
        }
        break;

      default:
        this.column += tokenLexeme.length;
        break;
    }

    switch (tokenType) {
      case Types.EOL:
      case Types.DTD:
      case Types.SKIP:
      case Types.COMMENT:
      case Types.EXTERNAL_STYLE_SHEETS:
        return this.getNextToken();
      default:
        return buildToken(tokenType, tokenLexeme, previousLine, previousColumn);
    }
  }

  //--------------------------------------------------------------------------//

  public setSpecs(specsToUse: TSpec[]) {
    this.specs = specsToUse;
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
      return buildEOFToken(this.line, this.column);
    }

    if (specsToUse) {
      this.specs = specsToUse;
    }

    const strToCheck = this.source.slice(this.cursor);

    for (const [regexp, tokenType] of this.specs) {
      const tokenLexeme = this.matchHelper(
        regexp,
        strToCheck,
        this.getMatchedIndex(tokenType)
      );

      if (tokenLexeme === null) {
        continue;
      }

      return this.runTokenAction(tokenType, tokenLexeme);
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

    if (token.type === Types.EOF) {
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
