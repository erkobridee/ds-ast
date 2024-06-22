import type {
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

//----------------------------------------------------------------------------//

export class StateMachine {
  constructor(readonly lexer: Lexer) {}

  //--------------------------------------------------------------------------//

  /**
   * Start the State Machine that will generate the AST
   *
   * @returns {ASTNode} - the abstract syntax tree
   */
  public start() {
    return this.Program();
  }

  //--------------------------------------------------------------------------//
  // @begin: lexer helpers

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

  // @end: lexer helpers
  //--------------------------------------------------------------------------//
  // @begin states definitions

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
   *   : Statement+
   *   ;
   */
  private StatementList(stopLookahedTokenType?: string) {
    const statementList: TStatement[] = [this.Statement()];

    const typesToCheck = [TokenTypes.EOF, stopLookahedTokenType];

    while (!typesToCheck.includes(this.getLookaheadTokenType())) {
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
   *   : '{' StatementList? '}'
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
   * Generic binary expression
   *
   * binaryExpressionHelper
   *  : ( MultiplicativeExpression ADDITIVE_OPERATOR )+ MultiplicativeExpression
   *  | ( PrimaryExpression MULTIPLICATIVE_OPERATOR )+ PrimaryExpression
   *  ;
   */
  private binaryExpressionHelper(
    builderName: BinaryBuilderName,
    operatorTokenType: string
  ) {
    let left: TExpression = this[builderName]() as TExpression;

    while (this.getLookaheadTokenType() === operatorTokenType) {
      // Operator: *, /, +, -
      const operator = this.eatToken(operatorTokenType).lexeme!;

      const right = this[builderName]() as TExpression;

      left = nodeFactory.BinaryExpression(operator, left, right);
    }

    return left;
  }

  /**
   * AdditiveExpression
   *  : ( MultiplicativeExpression ADDITIVE_OPERATOR )+ MultiplicativeExpression
   *  ;
   *
   *
   * it calls binaryExpressionHelper( MultiplicativeExpression, ADDITIVE_OPERATOR )
   */
  private AdditiveExpression() {
    return this.binaryExpressionHelper(
      BinaryBuilderName.MultiplicativeExpression,
      TokenTypes.ADDITIVE_OPERATOR
    );
  }

  /**
   * MultiplicativeExpression
   *  : ( PrimaryExpression MULTIPLICATIVE_OPERATOR )+ PrimaryExpression
   *  ;
   *
   *
   * it calls binaryExpressionHelper( PrimaryExpression, MULTIPLICATIVE_OPERATOR )
   */
  private MultiplicativeExpression() {
    return this.binaryExpressionHelper(
      BinaryBuilderName.PrimaryExpression,
      TokenTypes.MULTIPLICATIVE_OPERATOR
    );
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

  // @end states definitions
  //--------------------------------------------------------------------------//
}

export default StateMachine;
