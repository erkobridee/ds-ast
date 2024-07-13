export enum DocumentType {
  XML = 'XML',
  HTML = 'HTML',
}

export interface IDocumentProlog {
  doctype: DocumentType;
  version?: string;
  encoding?: string;
}

//----------------------------------------------------------------------------//

export enum NodeType {
  Document = 'Document',
  Element = 'Element',
  AutoCloseElement = 'AutoCloseElement',
  /** `script` or `style` */
  SpecialElement = 'SpecialElement',
  /** for eg. `meta`, `link`, `img`, `input`, ... */
  VoidElement = 'VoidElement',
  Text = 'Text',
  CData = 'CData',
  RawText = 'RawText',
}

//----------------------------------------------------------------------------//

export interface INodeBase {
  type: NodeType;
}

export interface INodeValue extends INodeBase {
  value: string;
}

//---//

export interface INodeText extends INodeValue {
  type: NodeType.Text;
}

export interface INodeCData extends INodeValue {
  type: NodeType.CData;
}

export interface INodeRawText extends INodeValue {
  type: NodeType.RawText;
}

//---//

export interface IElementAttribute {
  name: string;
  value?: string;
}

export interface INodeElementBase extends INodeBase {
  name: string;
  attributes?: IElementAttribute[];
}

/**
 * Special Element which its content is a raw text
 */
export interface INodeSpecialElement extends INodeElementBase {
  type: NodeType.SpecialElement;
  content: INodeRawText;
}

export type TElementChildren =
  | INodeText
  | INodeCData
  | INodeElement
  | INodeSpecialElement;

export type TNodeElementType =
  | NodeType.Element
  | NodeType.AutoCloseElement
  | NodeType.VoidElement
  | NodeType.SpecialElement;

export interface INodeElement extends INodeElementBase {
  type: TNodeElementType;
  children?: TElementChildren[];
}

//---//

export interface INodeDocument extends INodeBase {
  type: NodeType.Document;
  prolog: IDocumentProlog;
  root: INodeElement;
}

//----------------------------------------------------------------------------//

export const nodeFactory = {
  Document: ({
    root,
    prolog,
  }: {
    root: INodeElement;
    prolog: IDocumentProlog;
  }): INodeDocument => ({
    type: NodeType.Document,
    prolog,
    root,
  }),

  Element: ({
    type = NodeType.Element,
    name,
    attributes,
    children,
  }: {
    type?: TNodeElementType;
    name: string;
    attributes?: IElementAttribute[];
    children?: TElementChildren[];
  }): INodeElement => ({
    type,
    name,
    attributes,
    children,
  }),

  SpecialElement: ({
    name,
    attributes,
    content,
  }: {
    name: string;
    attributes?: IElementAttribute[];
    content: INodeRawText;
  }): INodeSpecialElement => ({
    type: NodeType.SpecialElement,
    name,
    attributes,
    content,
  }),

  RawText: (value: string): INodeRawText => ({
    type: NodeType.RawText,
    value,
  }),

  Text: (value: string): INodeText => ({
    type: NodeType.Text,
    value,
  }),

  CData: (value: string): INodeCData => ({
    type: NodeType.CData,
    value,
  }),
};

//----------------------------------------------------------------------------//

export type TAbstractSyntaxTree = INodeDocument;
