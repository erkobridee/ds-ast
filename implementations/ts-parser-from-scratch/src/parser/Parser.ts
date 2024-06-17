import type { IToken } from '~/lexer/Token';
import type {
  TAbstractSyntaxTree,
  INodeProgram,
  TStatement,
  TExpression,
  INodeNumericLiteral,
  INodeStringLiteral,
} from './AST';

import { Lexer, TokenTypes } from '~/lexer';
import { nodeFactory } from './AST';

/**
 * Recursive descent parser implementation.
 *
 * LL(1) parser type.
 */
export class Parser {
  private lexer: Lexer;

  private lookahead: IToken | null = null;

  /**
   * Initializes the parser
   */
  constructor() {
    this.lexer = new Lexer();
  }

  /**
   * Parses the source code and returns the abstract syntax tree
   *
   * @param {string} source - the source code
   * @returns {ASTNode} - the abstract syntax tree
   */
  public parse(source = ''): TAbstractSyntaxTree {
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

  private getLookaheadTokenType() {
    return this.lookahead?.type;
  }

  //--------------------------------------------------------------------------//
  // @begin: states machine

  /**
   * Main entry point
   *
   * Program
   *   : Literal
   *   ;
   */
  private Program(): INodeProgram {
    return nodeFactory.Program(this.StatementList());
  }

  /**
   * StatementList
   *   : Statement
   *   | StatementList Statement -> Statement Statement Statement Statement
   *   ;
   */
  private StatementList(stopLookahedTokenType?: string) {
    const statementList: TStatement[] = [this.Statement()];

    while (
      this.lookahead !== null &&
      this.getLookaheadTokenType() !== stopLookahedTokenType
    ) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement
   *   : EmptyStatement
   *   | BlockStatement
   *   | ExpressionStatement
   *   ;
   */
  private Statement() {
    switch (this.getLookaheadTokenType()) {
      case ';':
        return this.EmptyStatement();
      case '{':
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  /**
   * EmptyStatement
   *   : ';'
   *   ;
   */
  private EmptyStatement() {
    this.eatToken(';');
    return nodeFactory.EmptyStatement();
  }

  /**
   * BlockStatement
   *   : '{' OptStatementList '}'
   *   ;
   */
  private BlockStatement() {
    this.eatToken('{');

    const body =
      this.getLookaheadTokenType() !== '}' ? this.StatementList('}') : [];

    this.eatToken('}');

    return nodeFactory.BlockStatement(body);
  }

  /**
   * ExpressionStatement
   *   : Expression ';'
   *   ;
   */
  private ExpressionStatement() {
    const expression = this.Expression();

    this.eatToken(';');

    return nodeFactory.ExpressionStatement(expression);
  }

  /**
   * Expression
   *   : AdditiveExpression
   *   ;
   */
  private Expression() {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   *  : Literal
   *  | AdditiveExpression ADDITIVE_OPERATOR Literal -> Literal ADDITIVE_OPERATOR Literal ADDITIVE_OPERATOR Literal
   *  ;
   */
  private AdditiveExpression() {
    let left: TExpression = this.Literal();

    while (this.getLookaheadTokenType() === 'ADDITIVE_OPERATOR') {
      // Operator: +, -
      const operator = this.eatToken('ADDITIVE_OPERATOR').lexeme!;

      const right = this.Literal();

      left = nodeFactory.BinaryExpression(operator, left, right);
    }

    return left;
  }

  /**
   * Literal
   *   : NumericLiteral
   *   | StringLiteral
   *   ;
   */
  private Literal() {
    switch (this.getLookaheadTokenType()) {
      case TokenTypes.NUMBER:
        return this.NumericLiteral();
      case TokenTypes.STRING:
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
    const token = this.eatToken(TokenTypes.NUMBER);

    return nodeFactory.NumericLiteral(Number(token.lexeme));
  }

  /**
   * StringLiteral
   *   : STRING
   *   ;
   */
  private StringLiteral(): INodeStringLiteral {
    const token = this.eatToken(TokenTypes.STRING);

    return nodeFactory.StringLiteral(token.lexeme!.slice(1, -1));
  }

  // @end: states machine
  //--------------------------------------------------------------------------//
}

export default Parser;
