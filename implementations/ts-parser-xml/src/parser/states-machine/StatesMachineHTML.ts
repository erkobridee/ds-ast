/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { TAbstractSyntaxTree } from '~/parser/AST';

import { AbstractStatesMachine } from './AbstractStatesMachine';

export class StatesMachineHTML extends AbstractStatesMachine {
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
   *  : SpecialElement
   *  | VoidElement
   *  | AutoCloseElement
   *  | ContentElement
   *  ;
   */
  protected Element() {
    throw new Error('Not implemented');
  }

  /**
   * SpecialElement
   *  : '<' 'script' Attribute* '>' RAW_TEXT? '<' '/' 'script' '>
   *  | '<' 'style' Attribute* '>' RAW_TEXT '<' '/' 'style' '>
   *  ;
   */
  protected SpecialElement() {
    throw new Error('Not implemented');
  }

  /**
   * VoidElement
   *  : '<' VOID_TAG_NAME Attribute* '>'
   *  ;
   */
  protected VoidElement() {
    throw new Error('Not implemented');
  }

  /**
   * AutoCloseElement
   *  : '<' NAME Attribute* '/' '>'
   *  ;
   */
  protected AutoCloseElement() {
    throw new Error('Not implemented');
  }

  /**
   * WithContentElement
   *  : '<' NAME Attribute* '>' Content* '<' '/' NAME '>'
   *  ;
   */
  protected ContentElement() {
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

export default StatesMachineHTML;
