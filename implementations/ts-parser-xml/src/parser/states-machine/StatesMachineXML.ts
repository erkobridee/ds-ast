/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { INodeElement, INodeText } from '~/parser/AST';

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
   *  : OpenTag AutoCloseTag
   *  | OpenTag Content* CloseTag
   *  ;
   */
  protected Element(skipFirstToken = false): INodeElement {
    // TODO: remove
    console.log('Element');

    const element = this.OpenTag(skipFirstToken);

    switch (this.getLookaheadTokenType()) {
      case '/':
        this.AutoCloseTag();
        return element;
      case '>':
        const content = this.Content(element);

        //
        // TODO: find out how to handle the content loop between text child and element child
        //

        if (content) {
          element.children
            ? element.children.push(content)
            : (element.children = [content]);
        }

        this.CloseTag(!!content);

        return element;
    }

    throw new SyntaxError(
      `Element: Unexpected tag production. The last token type found was: "${this.getLookaheadTokenType()}"`
    );
  }

  /**
   * Content
   *  : ( Text Element )* Text
   *  | Element Text?
   *  ;
   */
  protected Content(parentElement: INodeElement) {
    this.eatToken('>');

    //
    // TODO: find out how to handle the content loop between text child and element child
    //

    switch (this.getLookaheadTokenType()) {
      case this.TokenTypes.TEXT:
        return this.Text(parentElement);
      case '<':
        this.Element(); // TODO: review here
      default:
        return;
    }
  }

  /**
   * ```
   * Text
   *  : TEXT
   *  ;
   * ```
   */
  protected Text(parentElement: INodeElement): INodeText | undefined {
    const text = this.eatToken(this.TokenTypes.TEXT);

    const textChild = this.nodeFactory.Text(text.lexeme!);

    this.eatToken('<');

    switch (this.getLookaheadTokenType()) {
      case '/':
        return textChild;
      case this.TokenTypes.NAME:
        this.Element(true); // TODO: double check here
        return;
    }

    throw new SyntaxError(
      `TextChild: Unexpected tag production. Next Token found "${this.getLookaheadTokenType()}" and it was expected one of [ '/', '${
        this.TokenTypes.NAME
      }' ].`
    );
  }

  protected ElementChild(): undefined {
    //
    // TODO: find out how to check if the next token is a TEXT
    //

    throw new Error('Not implemented');
  }

  // @end: states definitions
  //--------------------------------------------------------------------------//
}

export default StatesMachineXML;
