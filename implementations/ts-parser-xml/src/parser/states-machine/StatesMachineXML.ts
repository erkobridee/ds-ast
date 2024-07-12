/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { INodeElement } from '~/parser/AST';

import { AbstractStatesMachineImpl } from './AbstractStatesMachineImpl';

export class StatesMachineXML extends AbstractStatesMachineImpl {
  constructor(lexer: Lexer) {
    super(lexer);

    this.contentType = this.DocumentType.XML;
  }

  //--------------------------------------------------------------------------//
  // @begin: states definitions

  /**
   * Element
   *  : '<' NAME AttributeList '/' '>'
   *  | '<' NAME AttributeList '>' Content* '<' '/' NAME '>'
   *  ;
   */
  protected Element(): INodeElement {
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
