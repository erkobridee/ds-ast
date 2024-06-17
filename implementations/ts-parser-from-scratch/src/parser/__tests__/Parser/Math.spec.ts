import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

describe('Math Expression', () => {
  describe('addition', () => {
    // adition
    // left: 2
    // right: 2
    it('2 + 2', () => {
      const parser = new Parser();

      expect(parser.parse('2 + 2;')).toMatchObject(
        // TODO: review
        /*
        nodeFactory.Program([
          nodeFactory.ExpressionStatement({
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'NumericLiteral',
                value: 2,
              },
              right: {
                type: 'NumericLiteral',
                value: 2,
              },
              operator: '+',
            },
          }),
        ])
          */
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                  type: 'NumericLiteral',
                  value: 2,
                },
                right: {
                  type: 'NumericLiteral',
                  value: 2,
                },
              },
            },
          ],
        }
      );
    });

    // nested binary expression:
    // left: 3 + 2
    // right: 2
    it('3 + 2 - 2;', () => {
      const parser = new Parser();
      expect(parser.parse('3 + 2 - 2;')).toMatchObject(
        // TODO: review
        {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: {
                    type: 'NumericLiteral',
                    value: 3,
                  },
                  right: {
                    type: 'NumericLiteral',
                    value: 2,
                  },
                },
                right: {
                  type: 'NumericLiteral',
                  value: 2,
                },
              },
            },
          ],
        }
      );
    });
  });

  it('subtraction', () => {});
  it('multiplication', () => {});
  it('division', () => {});
  it('exponentiation', () => {});
  it('modulo', () => {});
});
