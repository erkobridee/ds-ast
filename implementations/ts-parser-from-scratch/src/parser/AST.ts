export interface INodeBase {
  type: string;
}

//----------------------------------------------------------------------------//

export interface INodeStringLiteral extends INodeBase {
  type: 'StringLiteral';
  value: string;
}

export interface INodeNumericLiteral extends INodeBase {
  type: 'NumericLiteral';
  value: number;
}

export type TLiteral = INodeNumericLiteral | INodeStringLiteral;

export interface INodeProgram extends INodeBase {
  type: 'Program';
  body: TLiteral;
}

//----------------------------------------------------------------------------//

export type TAbstractSyntaxTree = INodeProgram;
