import type { TAbstractSyntaxTree } from './AST';

import { Lexer } from '~/lexer';
import { AvailableStatesMachine, StatesMachine } from './states-machine';

//----------------------------------------------------------------------------//

/**
 * Recursive descent parser implementation.
 *
 * LL(1) parser type.
 */
export class Parser {
  private lexer: Lexer;
  private statesMachine: StatesMachine;
  public readonly type: AvailableStatesMachine;

  /**
   * Initializes the parser
   */
  constructor(type: AvailableStatesMachine = AvailableStatesMachine.XML) {
    const lexer = new Lexer();

    this.lexer = lexer;
    this.type = type;

    this.statesMachine = new StatesMachine(lexer, type);
  }

  /**
   * Parses the source code and returns the abstract syntax tree
   *
   * @param {string} source - the source code
   * @returns {TAbstractSyntaxTree} - the abstract syntax tree
   */
  public parse(source = ''): TAbstractSyntaxTree {
    if (source.length === 0) {
      throw new SyntaxError('There is no source code to parse');
    }

    this.lexer.init(source);

    return this.statesMachine.start();
  }
  //--------------------------------------------------------------------------//
}

export default Parser;
