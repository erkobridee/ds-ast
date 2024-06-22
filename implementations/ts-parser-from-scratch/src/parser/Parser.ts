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

//----------------------------------------------------------------------------//

enum BinaryBuilderName {
  PrimaryExpression = 'PrimaryExpression',
  MultiplicativeExpression = 'MultiplicativeExpression',
}

/**
 * Recursive descent parser implementation.
 *
 * LL(1) parser type.
 */
export class Parser {
  private lexer: Lexer;

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

    return this.startStateMachine();
  }

  //--------------------------------------------------------------------------//
  // TODO: review

  /**
   * Expects a token of a given type
   *
   * @param {string} tokenType
   * @returns {IToken} the expected token
   */
  private eatToken(tokenType: string) {
    return this.lexer.eatToken(tokenType);
  }

  private getLookaheadTokenType() {
    return this.lexer.getLookaheadTokenType();
  }

  //--------------------------------------------------------------------------//
  // @begin: states machine

  /**
   * Start the State Machine that will generate the AST
   *
   * @returns {ASTNode} - the abstract syntax tree
   */
  private startStateMachine() {
    /*
      Parse recursively, starting from the main entry point
      the Program
    */
    return this.Program();
  }

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
      ![TokenTypes.EOF, stopLookahedTokenType].includes(
        this.getLookaheadTokenType()
      )
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
   *  : MultiplicativeExpression
   *  | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression -> MultiplicativeExpression ADDITIVE_OPERATOR MultiplicativeExpression ADDITIVE_OPERATOR MultiplicativeExpression
   *  ;
   */
  private AdditiveExpression() {
    return this.binaryExpressionHelper(
      BinaryBuilderName.MultiplicativeExpression,
      TokenTypes.ADDITIVE_OPERATOR
    );
  }

  /**
   * MultiplicativeExpression
   *  : PrimaryExpression
   *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   */
  private MultiplicativeExpression() {
    return this.binaryExpressionHelper(
      BinaryBuilderName.PrimaryExpression,
      TokenTypes.MULTIPLICATIVE_OPERATOR
    );
  }

  /**
   * Generic binary expression
   */
  private binaryExpressionHelper(
    builderName: BinaryBuilderName,
    operatorTokenType: string
  ) {
    let left: TExpression = this[builderName]() as TExpression;

    while (this.getLookaheadTokenType() === operatorTokenType) {
      // Operator: *, /
      const operator = this.eatToken(operatorTokenType).lexeme!;

      const right = this[builderName]() as TExpression;

      left = nodeFactory.BinaryExpression(operator, left, right);
    }

    return left;
  }

  /**
   * This will enforce the correct precedence inside of the AST
   *
   * PrimaryExpression
   *   : ParenthesizedExpression
   *   | Literal
   *   ;
   */
  private PrimaryExpression() {
    switch (this.getLookaheadTokenType()) {
      case '(':
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  /**
   * ParenthesizedExpression
   *   : '(' Expression ')'
   *   ;
   */
  private ParenthesizedExpression(): TExpression {
    this.eatToken('(');
    const expression = this.Expression();
    this.eatToken(')');
    return expression;
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
