/*
  Classes | TypeScript Docs
  https://www.typescriptlang.org/docs/handbook/2/classes.html

  TypeScript Abstract Classes | TypeScript Tutorial
  https://www.typescripttutorial.net/typescript-tutorial/typescript-abstract-classes/

  TypeScript - Abstract Class | TutorialsTeacher
  https://www.tutorialsteacher.com/typescript/abstract-class
*/

import { Lexer } from '~/lexer';
import { TAbstractSyntaxTree } from '~/parser/AST';

export abstract class AbstractStatesMachine {
  protected lexer: Lexer;

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
}

export default AbstractStatesMachine;
