/*
  EBNF: How to describe the grammar of a language
  https://tomassetti.me/ebnf/
 */

import { Lexer } from '~/lexer';
import { INodeElement, TElementChildren } from '~/parser/AST';

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
    //
    // Tokens sequence examples
    //
    // < NAME AttributeList / > EOF
    // < NAME AttributeList > < / NAME > EOF
    // < NAME AttributeList > TEXT < / NAME > EOF
    // < NAME AttributeList > TEXT < NAME AttributeList / > < / NAME > EOF
    // < NAME AttributeList > TEXT < NAME AttributeList > < / NAME > < / NAME > EOF
    // < NAME AttributeList > TEXT < NAME AttributeList / > TEXT < / NAME > EOF
    // < NAME AttributeList > TEXT < NAME AttributeList > < / NAME > TEXT < / NAME > EOF
    // < NAME AttributeList > < NAME AttributeList / > TEXT < / NAME > EOF
    // < NAME AttributeList > < NAME AttributeList > < / NAME > TEXT < / NAME > EOF
    //

    const element = this.OpenTag(skipFirstToken);

    switch (this.getLookaheadTokenType()) {
      case '/':
        this.AutoCloseTag();

        return element;
      case '>':
        this.eatToken('>', this.TokenSpecs.TagContent);

        element.children = this.Content();

        return element;
    }

    throw new SyntaxError(
      `Element: Unexpected tag production. The last token type found was: "${this.getLookaheadTokenType()}"`
    );
  }

  /**
   *  Content
   *   : ( TEXT | Element )*
   *   ;
   */
  protected Content(): TElementChildren[] | undefined {
    let elements: TElementChildren[] | undefined;

    const pushElement = (element: TElementChildren) => {
      if (!elements) elements = [element];
      else elements.push(element);
    };

    while (this.getLookaheadTokenType() !== this.TokenTypes.EOF) {
      if (this.getLookaheadTokenType() === this.TokenTypes.TEXT) {
        const textToken = this.eatToken(this.TokenTypes.TEXT);

        pushElement(this.nodeFactory.Text(textToken.lexeme!));

        continue;
      }

      if (this.getLookaheadTokenType() === '<') {
        this.eatToken('<', this.TokenSpecs.TagDecl);

        switch (this.getLookaheadTokenType()) {
          case '/':
            this.CloseTag(true /* skipFirstToken */);

            continue;
          case this.TokenTypes.NAME:
            pushElement(this.Element(true /* skipFirstToken */));

            continue;
        }
      }
    }

    return elements;
  }

  // @end: states definitions
  //--------------------------------------------------------------------------//
}

export default StatesMachineXML;
