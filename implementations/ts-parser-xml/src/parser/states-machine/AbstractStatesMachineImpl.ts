import { Lexer, TokenSpecs, TokenTypes, TSpec } from '~/lexer';
import {
  TAbstractSyntaxTree,
  TElementChildren,
  INodeElement,
  IElementAttribute,
  DocumentType,
  NodeType,
  nodeFactory,
} from '~/parser/AST';

import { AbstractStatesMachine } from './AbstractStatesMachine';

export abstract class AbstractStatesMachineImpl extends AbstractStatesMachine {
  protected TokenTypes = TokenTypes;
  protected TokenSpecs = TokenSpecs;
  protected NodeType = NodeType;
  protected DocumentType = DocumentType;
  protected nodeFactory = nodeFactory;

  //-------------------------------------------------------------------------//

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
   * @param {TSpec[]} specsToUse
   */
  protected setSpecs(specsToUse: TSpec[]) {
    this.lexer.setSpecs(specsToUse);
  }

  /**
   * Expects a token of a given type
   *
   * @param {string} tokenType
   * @param {TSpec[]} specsToUse - optional
   * @returns {IToken} the expected token
   */
  protected eatToken(tokenType: string, specsToUse?: TSpec[]) {
    return this.lexer.eatToken(tokenType, specsToUse);
  }

  protected getLookaheadTokenType() {
    return this.lexer.getLookaheadTokenType();
  }

  // @end: lexer helpers
  //--------------------------------------------------------------------------//
  // @begin: processment stack

  protected elementsStack: INodeElement[] = [];

  protected stackPush(element: INodeElement) {
    this.elementsStack.push(element);
  }

  protected stackPop() {
    const length = this.elementsStack.length;
    const parent = this.elementsStack[length - 2];
    const current = this.elementsStack.pop();

    // if (parent && current) {
    //   parent.children
    //     ? parent.children.push(current)
    //     : (parent.children = [current]);
    // }

    return current;
  }

  protected stackTopParent() {
    return this.elementsStack[this.elementsStack.length - 2];
  }

  protected stackTop() {
    return this.elementsStack[this.elementsStack.length - 1];
  }

  // @end: processment stack
  //--------------------------------------------------------------------------//
  // @begin: states definitions

  /**
   * ```
   * Document
   *  : Prolog? Element EOF
   *  ;
   *```
   */
  private Document(): TAbstractSyntaxTree {
    return this.nodeFactory.Document({
      prolog: this.Prolog(),
      root: this.Element(),
    });
  }

  /**
   * ```
   * Prolog
   *  : XML_DECL_START AttributeList SPECIAL_CLOSE
   *  ;
   * ```
   */
  private Prolog() {
    let attributesMap: Record<string, string | undefined> = {};

    if (this.getLookaheadTokenType() === TokenTypes.XML_DECL_START) {
      this.eatToken(TokenTypes.XML_DECL_START);

      if (this.getLookaheadTokenType() === TokenTypes.NAME) {
        const attributes =
          this.AttributeList(
            [TokenTypes.SPECIAL_CLOSE],
            ['version', 'encoding']
          ) || [];

        attributes.forEach(({ name, value }) => {
          attributesMap[name] = value;
        });
      }

      this.eatToken(TokenTypes.SPECIAL_CLOSE);
    }

    return nodeFactory.Prolog({ doctype: this.contentType!, ...attributesMap });
  }

  /**
   * Process a list of attributes until the defined stop tokens
   * and this function will returns [ Attribute[], TokenType ]
   *
   * ```
   * AttributeList
   *  : Attribute*
   *  ;
   * ```
   */
  protected AttributeList(
    stopLookahedTokenTypes: string[],
    expectedAttributeNames?: string[]
  ): IElementAttribute[] | undefined {
    let attributes: IElementAttribute[] | undefined;

    while (!stopLookahedTokenTypes.includes(this.getLookaheadTokenType())) {
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

      if (!attributes) attributes = [attribute];
      else attributes.push(attribute);
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

      value = this.eatToken(TokenTypes.STRING).lexeme!.slice(1, -1);
    }

    return { name, value };
  }

  /**
   * ```
   * OpenTag
   *  : '<'? NAME AttributeList ( '/' | '>' )
   *  ;
   * ```
   */
  protected OpenTag(skipFirstToken = false) {
    if (!skipFirstToken) {
      this.eatToken('<', TokenSpecs.TagDecl);
    }

    const name = this.eatToken(TokenTypes.NAME).lexeme!;

    const attributes = this.AttributeList(['/', '>']);

    const element = this.nodeFactory.Element({ name, attributes });

    this.stackPush(element);

    return element;
  }

  /**
   * ```
   * AutoCloseTag
   *  : '/' '>'
   *  ;
   */
  protected AutoCloseTag() {
    this.eatToken('/');

    this.eatToken('>', this.TokenSpecs.TagContent);

    this.stackPop();
  }

  /**
   * ```
   * CloseTag
   *  : '<'? '/' NAME '>'
   *  ;
   * ```
   */
  protected CloseTag(skipFirstToken = false) {
    const currentTag = this.stackPop();

    if (!skipFirstToken) this.eatToken('<', this.TokenSpecs.TagDecl);

    this.eatToken('/');

    const name = this.eatToken(TokenTypes.NAME).lexeme!;

    if (!currentTag) {
      throw new SyntaxError(
        `CloseTag: Unexpected tag production. Missing Element on the Elements Stack.`
      );
    } else if (currentTag.name !== name) {
      throw new SyntaxError(
        `CloseTag: Unexpected tag production. Wrong closing tag, it was expected "${currentTag.name}", but it was found "${name}".`
      );
    }

    this.eatToken('>', this.TokenSpecs.TagContent);
  }

  // It needs to be implemented on the specific states machine implementation
  protected abstract Element(): INodeElement;

  // @end: states definitions
  //--------------------------------------------------------------------------//
}

export default AbstractStatesMachineImpl;
