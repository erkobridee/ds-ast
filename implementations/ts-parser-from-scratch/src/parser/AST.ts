export enum NodeTypes {
  Program = 'Program',
  ExpressionStatement = 'ExpressionStatement',
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

export interface INodeExpressionStatement extends INodeBase {
  type: NodeTypes.ExpressionStatement;
  expression: TLiteral;
}

export interface INodeProgram extends INodeBase {
  type: NodeTypes.Program;
  body: INodeExpressionStatement[];
}

//----------------------------------------------------------------------------//

export const nodeFactory = {
  Program: (body: INodeExpressionStatement[]): INodeProgram => ({
    type: NodeTypes.Program,
    body,
  }),
  ExpressionStatement: (expression: TLiteral): INodeExpressionStatement => ({
    type: NodeTypes.ExpressionStatement,
    expression,
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
