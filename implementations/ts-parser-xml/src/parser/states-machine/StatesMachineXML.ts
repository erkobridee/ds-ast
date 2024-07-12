/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { TAbstractSyntaxTree } from '~/parser/AST';

import { AbstractStatesMachine } from './AbstractStatesMachine';

export class StatesMachineXML extends AbstractStatesMachine {
  constructor(lexer: Lexer) {
    super(lexer);
  }

  public start(): TAbstractSyntaxTree {
    return this.Document();
  }

  //--------------------------------------------------------------------------//
  // @begin: states definitions

  /**
   * Document
   *  : Prolog? Element EOF
   *  ;
   *
   */
  private Document(): TAbstractSyntaxTree {
    throw new Error('Not implemented');
  }

  /**
   * Prolog
   *  : XML_DECL_START Attribute* SPECIAL_CLOSE
   *  ;
   */
  protected Prolog() {
    throw new Error('Not implemented');
  }

  /**
   * Element
   *  : '<' NAME Attribute* '/' '>'
   *  | '<' NAME Attribute* '>' Content* '<' '/' NAME '>'
   *  ;
   */
  protected Element() {
    throw new Error('Not implemented');
  }

  /**
   * Attribute
   *  : NAME '=' STRING
   *  | NAME
   *  ;
   */
  protected Attribute() {
    throw new Error('Not implemented');
  }

  /**
   * Content
   *  : TEXT
   *  | Element
   *  ;
   */
  protected Content() {
    throw new Error('Not implemented');
  }

  // @end: states definitions
  //--------------------------------------------------------------------------//
}

export default StatesMachineXML;
