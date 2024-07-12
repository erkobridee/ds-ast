/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { INodeElement } from '~/parser/AST';

import { AbstractStatesMachineImpl } from './AbstractStatesMachineImpl';

export class StatesMachineHTML extends AbstractStatesMachineImpl {
  constructor(lexer: Lexer) {
    super(lexer);

    this.contentType = this.DocumentType.HTML;
  }

  //--------------------------------------------------------------------------//
  // @begin: states definitions

  /**
   * Element
   *  : SpecialElement
   *  | VoidElement
   *  | AutoCloseElement
   *  | ContentElement
   *  ;
   */
  protected Element(): INodeElement {
    throw new Error('Not implemented');
  }

  /**
   * SpecialElement
   *  : '<' 'script' AttributeList '>' RAW_TEXT? '<' '/' 'script' '>
   *  | '<' 'style' AttributeList '>' RAW_TEXT '<' '/' 'style' '>
   *  ;
   */
  protected SpecialElement() {
    throw new Error('Not implemented');
  }

  /**
   * VoidElement
   *  : '<' VOID_TAG_NAME AttributeList '>'
   *  ;
   */
  protected VoidElement() {
    throw new Error('Not implemented');
  }

  /**
   * AutoCloseElement
   *  : '<' NAME AttributeList '/' '>'
   *  ;
   */
  protected AutoCloseElement() {
    throw new Error('Not implemented');
  }

  /**
   * WithContentElement
   *  : '<' NAME AttributeList '>' Content* '<' '/' NAME '>'
   *  ;
   */
  protected ContentElement() {
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

export default StatesMachineHTML;
