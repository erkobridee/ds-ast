import type { IToken } from '~/lexer/Token';
import type {
  TAbstractSyntaxTree,
  INodeProgram,
  INodeNumericLiteral,
  INodeStringLiteral,
} from './AST';

import { Lexer } from '~/lexer';
import { nodeFactory } from './AST';

/**
 * Recursive descent parser implementation.
 *
 * LL(1) parser type.
 */
export class Parser {
  private lexer: Lexer;

  // TODO: review
  // private source = '';

  private lookahead: IToken | null = null;

  /**
   * Initializes the parser
   */
  constructor() {
    this.lexer = new Lexer();

    // TODO: review
    // this.source = '';
  }

  /**
   * Parses the source code and returns the abstract syntax tree
   *
   * @param {string} source - the source code
   * @returns {ASTNode} - the abstract syntax tree
   */
  public parse(source = ''): TAbstractSyntaxTree {
    // TODO: review
    // this.source = source;

    if (source.length === 0) {
      throw new SyntaxError('There is no source code to parse');
    }

    this.lexer.init(source);

    /*
      Prime the tokenizer to obtain the first token
      which is our lookahead.

      The lookahead is used for predictive parsing.
    */
    this.lookahead = this.lexer.getNextToken();

    /*
      Parse recursively, starting from the main entry point
      the Program
    */
    return this.Program();
  }

  //--------------------------------------------------------------------------//

  /**
   * Expects a token of a given type
   *
   * @param {string} tokenType
   * @returns {IToken} the expected token
   */
  private eatToken(tokenType: string) {
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
    this.lookahead = this.lexer.getNextToken();

    return token;
  }

  //--------------------------------------------------------------------------//

  /**
   * Main entry point
   *
   * Program
   *   : Literal
   *   ;
   */
  private Program(): INodeProgram {
    return nodeFactory.Program(this.Literal());
  }

  /**
   * Literal
   *   : NumericLiteral
   *   | StringLiteral
   *   ;
   */
  private Literal() {
    switch (this.lookahead?.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
    }

    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  /**
   * NumericLiteral
   *   : NUMBER
   *   ;
   */
  private NumericLiteral(): INodeNumericLiteral {
    const token = this.eatToken('NUMBER');

    return nodeFactory.NumericLiteral(Number(token.lexeme));
  }

  /**
   * StringLiteral
   *   : STRING
   *   ;
   */
  private StringLiteral(): INodeStringLiteral {
    const token = this.eatToken('STRING');

    return nodeFactory.StringLiteral(token.lexeme!.slice(1, -1));
  }

  //--------------------------------------------------------------------------//
}

export default Parser;
