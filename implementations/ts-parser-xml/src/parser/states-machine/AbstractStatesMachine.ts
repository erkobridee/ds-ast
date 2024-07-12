/*
  Classes | TypeScript Docs
  https://www.typescriptlang.org/docs/handbook/2/classes.html

  TypeScript Abstract Classes | TypeScript Tutorial
  https://www.typescripttutorial.net/typescript-tutorial/typescript-abstract-classes/

  TypeScript - Abstract Class | TutorialsTeacher
  https://www.tutorialsteacher.com/typescript/abstract-class
*/

import { Lexer, TokenSpecs } from '~/lexer';
import { TAbstractSyntaxTree } from '~/parser/AST';

export abstract class AbstractStatesMachine {
  protected lexer: Lexer;
  protected TokenSpecs = TokenSpecs;

  //--------------------------------------------------------------------------//

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  /**
   * Start the State Machine that will generate the AST
   *
   * @returns {TAbstractSyntaxTree} - the abstract syntax tree
   */
  public abstract start(): TAbstractSyntaxTree;

  //--------------------------------------------------------------------------//
  // @begin: lexer helpers

  /**
   * Expects a token of a given type
   *
   * @param {string} tokenType
   * @returns {IToken} the expected token
   */
  protected eatToken(tokenType: string) {
    return this.lexer.eatToken(tokenType);
  }

  protected getLookaheadTokenType() {
    return this.lexer.getLookaheadTokenType();
  }

  // @end: lexer helpers
  //--------------------------------------------------------------------------//
}

export default AbstractStatesMachine;
