export enum NodeTypes {
  Program = 'Program',

  BlockStatement = 'BlockStatement',
  ExpressionStatement = 'ExpressionStatement',
  EmptyStatement = 'EmptyStatement',

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

export interface INodeBlockStatement extends INodeBase {
  type: NodeTypes.BlockStatement;
  body: TStatement[];
}

export interface INodeEmptyStatement extends INodeBase {
  type: NodeTypes.EmptyStatement;
}

export type TStatement =
  | INodeBlockStatement
  | INodeExpressionStatement
  | INodeEmptyStatement;

export interface INodeProgram extends INodeBase {
  type: NodeTypes.Program;
  body: TStatement[];
}

//----------------------------------------------------------------------------//

export const nodeFactory = {
  Program: (body: TStatement[]): INodeProgram => ({
    type: NodeTypes.Program,
    body,
  }),

  BlockStatement: (body: TStatement[]): INodeBlockStatement => ({
    type: NodeTypes.BlockStatement,
    body,
  }),

  ExpressionStatement: (expression: TLiteral): INodeExpressionStatement => ({
    type: NodeTypes.ExpressionStatement,
    expression,
  }),

  EmptyStatement: (): INodeEmptyStatement => ({
    type: NodeTypes.EmptyStatement,
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
