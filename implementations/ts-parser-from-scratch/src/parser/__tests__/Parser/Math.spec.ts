import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

const test = <E extends {} | any[]>(mathExpression: string, MatchObject: E) => {
  it(mathExpression, () => {
    const parser = new Parser();
    expect(parser.parse(mathExpression)).toMatchObject(MatchObject);
  });
};

describe('Math Expression', () => {
  describe('Additive Operations', () => {
    // adition
    // left: 2
    // right: 2
    test(
      '2 + 2;',
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(
          nodeFactory.BinaryExpression(
            '+',
            nodeFactory.NumericLiteral(2),
            nodeFactory.NumericLiteral(2)
          )
        ),
      ])
    );

    // nested binary expression:
    // left: 3 + 2
    // right: 2
    test(
      '3 + 2 - 2;',
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(
          nodeFactory.BinaryExpression(
            '-',
            nodeFactory.BinaryExpression(
              '+',
              nodeFactory.NumericLiteral(3),
              nodeFactory.NumericLiteral(2)
            ),
            nodeFactory.NumericLiteral(2)
          )
        ),
      ])
    );
  });

  describe('Multiplicative Operations', () => {
    test(
      '2 * 2;',
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(
          nodeFactory.BinaryExpression(
            '*',
            nodeFactory.NumericLiteral(2),
            nodeFactory.NumericLiteral(2)
          )
        ),
      ])
    );

    test(
      '2 * 2 / 2;',
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(
          nodeFactory.BinaryExpression(
            '/',
            nodeFactory.BinaryExpression(
              '*',
              nodeFactory.NumericLiteral(2),
              nodeFactory.NumericLiteral(2)
            ),
            nodeFactory.NumericLiteral(2)
          )
        ),
      ])
    );

    test(
      '2 + 2 * 2;',
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(
          nodeFactory.BinaryExpression(
            '+',
            nodeFactory.NumericLiteral(2),
            nodeFactory.BinaryExpression(
              '*',
              nodeFactory.NumericLiteral(2),
              nodeFactory.NumericLiteral(2)
            )
          )
        ),
      ])
    );
  });

  // it('exponentiation', () => {});
  // it('modulo', () => {});
});
