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

  private matchHelper(regexp: RegExp, strToCheck: string) {
    const matched = regexp.exec(strToCheck);

    if (matched === null) {
      return null;
    }

    const lexeme = matched[0];
    this.cursor += lexeme.length;
    return lexeme;
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
      case Types.RAW_TEXT:
        tokenLexeme = tokenLexeme.replace(/<\/$/, '');
        this.cursor -= 2;
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
      const tokenLexeme = this.matchHelper(regexp, strToCheck);

      if (tokenLexeme === null) {
        continue;
      }

      return this.runTokenAction(tokenType, tokenLexeme);
    }

    let message = `Lexer.getNextToken: Unexpected token`;
    message += ` @[ Ln ${this.line}, Col ${this.column} ]`;
    message += ` : "${strToCheck[0]}"`;

    throw new SyntaxError(message);
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
   * @param {TSpec[]} specsToUse - optional to use once reading the next token
   * @returns {IToken} the expected token
   */
  public eatToken(tokenType: string, specsToUse?: TSpec[]) {
    const token = this.lookahead;

    if (token.type === Types.EOF) {
      let message = `Lexer.eatToken: Unexpected end of input`;
      message += ` @[ Ln ${this.line}, Col ${this.column} ]`;
      message += `, expected: "${tokenType}"`;

      throw new SyntaxError(message);
    }

    if (token.type !== tokenType) {
      let message = `Lexer.eatToken: Unexpected token type`;
      message += ` @[ Ln ${this.line}, Col ${this.column} ]`;
      message += ` "${token.type}", expected: "${tokenType}"`;

      throw new SyntaxError(message);
    }

    // Advance to the next token
    this.lookahead = this.getNextToken(specsToUse);

    return token;
  }
}

export default Lexer;
