import { Lexer, TokenSpecs, TokenTypes } from '~/lexer';
import {
  TAbstractSyntaxTree,
  IDocumentProlog,
  INodeElement,
  IElementAttribute,
  DocumentType,
  NodeType,
  nodeFactory,
} from '~/parser/AST';

import { AbstractStatesMachine } from './AbstractStatesMachine';

export abstract class AbstractStatesMachineImpl extends AbstractStatesMachine {
  protected TokenSpecs = TokenSpecs;
  protected NodeType = NodeType;
  protected DocumentType = DocumentType;
  protected nodeFactory = nodeFactory;

  protected contentType: DocumentType | undefined;

  //--------------------------------------------------------------------------//

  constructor(lexer: Lexer) {
    super(lexer);
  }

  /**
   * Start the State Machine that will generate the AST
   *
   * @returns {TAbstractSyntaxTree} - the abstract syntax tree
   */
  public start(): TAbstractSyntaxTree {
    return this.Document();
  }

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

  // @begin: states definitions

  /**
   * Document
   *  : Prolog? Element EOF
   *  ;
   *
   */
  private Document(): TAbstractSyntaxTree {
    return this.nodeFactory.Document({
      prolog: this.Prolog(),
      root: this.Element(),
    });
  }

  /**
   * Prolog
   *  : XML_DECL_START AttributeList SPECIAL_CLOSE
   *  ;
   */
  private Prolog() {
    let attributes: IElementAttribute[] = [];

    if (this.getLookaheadTokenType() === TokenTypes.XML_DECL_START) {
      this.eatToken(TokenTypes.XML_DECL_START);

      if (this.getLookaheadTokenType() === TokenTypes.NAME) {
        attributes = this.AttributeList(TokenTypes.SPECIAL_CLOSE, [
          'version',
          'encoding',
        ]);
      }

      this.eatToken(TokenTypes.SPECIAL_CLOSE);
    }

    return {
      doctype: this.contentType!,
      ...attributes,
    } as IDocumentProlog;
  }

  protected abstract Element(): INodeElement;

  /**
   * AttributeList
   *  : Attribute*
   *  ;
   */
  protected AttributeList(
    stopLookahedTokenType: string,
    expectedAttributeNames?: string[]
  ): IElementAttribute[] {
    const attributes: IElementAttribute[] = [];

    while (this.getLookaheadTokenType() !== stopLookahedTokenType) {
      const attribute = this.Attribute();

      if (
        expectedAttributeNames &&
        !expectedAttributeNames.includes(attribute.name)
      ) {
        throw new SyntaxError(
          `AttributeList: Unexpected attribute production. Found: "${
            attribute.name
          }" and it was expected one of [ ${expectedAttributeNames.join(
            ', '
          )} ].`
        );
      }

      attributes.push(attribute);
    }

    return attributes;
  }

  /**
   * Attribute
   *  : NAME '=' STRING
   *  | NAME
   *  ;
   */
  protected Attribute(): IElementAttribute {
    let value: string | undefined;

    const name = this.eatToken(TokenTypes.NAME).lexeme!;

    if (this.getLookaheadTokenType() === '=') {
      this.eatToken('=');

      value = this.eatToken(TokenTypes.STRING).lexeme!;
    }

    return { name, value };
  }

  // @end: states definitions
  //--------------------------------------------------------------------------//
}

export default AbstractStatesMachineImpl;
