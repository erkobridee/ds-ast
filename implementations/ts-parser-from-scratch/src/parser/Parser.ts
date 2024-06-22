import type { TAbstractSyntaxTree } from './AST';

import { Lexer } from '~/lexer';
import { StateMachine } from './StateMachine';

//----------------------------------------------------------------------------//

/**
 * Recursive descent parser implementation.
 *
 * LL(1) parser type.
 */
export class Parser {
  private lexer: Lexer;
  private stateMachine: StateMachine;

  /**
   * Initializes the parser
   */
  constructor() {
    const lexer = new Lexer();
    this.lexer = lexer;
    this.stateMachine = new StateMachine(lexer);
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

    return this.stateMachine.start();
  }
  //--------------------------------------------------------------------------//
}

export default Parser;
