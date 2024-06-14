export enum NodeTypes {
  Program = 'Program',
  StringLiteral = 'StringLiteral',
  NumericLiteral = 'NumericLiteral',
}

export interface INodeBase {
  type: NodeTypes;
}

//----------------------------------------------------------------------------//

export interface INodeStringLiteral extends INodeBase {
  type: NodeTypes.StringLiteral;
  value: string;
}

export interface INodeNumericLiteral extends INodeBase {
  type: NodeTypes.NumericLiteral;
  value: number;
}

export type TLiteral = INodeNumericLiteral | INodeStringLiteral;

export interface INodeProgram extends INodeBase {
  type: NodeTypes.Program;
  body: TLiteral;
}

//----------------------------------------------------------------------------//

export const nodeFactory = {
  Program: (body: TLiteral): INodeProgram => ({
    type: NodeTypes.Program,
    body,
  }),
  StringLiteral: (value: string): INodeStringLiteral => ({
    type: NodeTypes.StringLiteral,
    value,
  }),
  NumericLiteral: (value: number): INodeNumericLiteral => ({
    type: NodeTypes.NumericLiteral,
    value,
  }),
};

//----------------------------------------------------------------------------//

export type TAbstractSyntaxTree = INodeProgram;
