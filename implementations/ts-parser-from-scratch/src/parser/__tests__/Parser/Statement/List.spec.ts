import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

it('statement list', () => {
  const parser = new Parser();

  expect(
    parser.parse(`

    // single line

    'hello';

    /* multi line comment in a line */

    /* 
      multi line comment 
    */

    42;

    /**
     * multi line comment documentation
     */

    'world!';
  `)
  ).toMatchObject(
    nodeFactory.Program([
      nodeFactory.ExpressionStatement(nodeFactory.StringLiteral('hello')),
      nodeFactory.ExpressionStatement(nodeFactory.NumericLiteral(42)),
      nodeFactory.ExpressionStatement(nodeFactory.StringLiteral('world!')),
    ])
  );
});
