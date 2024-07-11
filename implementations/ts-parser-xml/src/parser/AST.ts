export enum DocumentContentType {
  XML = 'XML',
  HTML = 'HTML',
}

export interface IDocumentProlog {
  // TODO: review
  type: DocumentContentType;
  version?: string;
  encoding?: string;
}

//----------------------------------------------------------------------------//

export enum NodeType {
  Document = 'Document',
  Element = 'Element',
  SpecialElement = 'SpecialElement',
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

export interface IElementAttriute {
  name: string;
  value: string;
}

export interface INodeElementBase extends INodeBase {
  name: string;
  attributes?: IElementAttriute[];
}

/**
 * Special Element which its content is a raw text
 */
export interface INodeSpecialElement extends INodeElementBase {
  type: NodeType.SpecialElement;
  content: INodeRawText;
}

export type TElementChildren = INodeText | INodeCData | INodeElement;

export interface INodeElement extends INodeElementBase {
  type: NodeType.Element;
  children: TElementChildren[];
}

//---//

export interface INodeDocument extends INodeBase {
  type: NodeType.Document;
  prolog: IDocumentProlog;
  root: INodeElement;
}

//----------------------------------------------------------------------------//
