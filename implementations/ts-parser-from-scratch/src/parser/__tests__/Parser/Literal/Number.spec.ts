import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

it('number', () => {
  const buildExpectedASTOutput = (value: number) =>
    nodeFactory.Program([
      nodeFactory.ExpressionStatement(nodeFactory.NumericLiteral(value)),
    ]);

  const parser = new Parser();

  expect(parser.parse('0;')).toMatchObject(buildExpectedASTOutput(0));
  expect(parser.parse('42;')).toMatchObject(buildExpectedASTOutput(42));
  expect(parser.parse('1337;')).toMatchObject(buildExpectedASTOutput(1337));

  expect(
    parser.parse(`

    // single line comment

    /* comment */

    /*
      multi line comment
    */

    /**
     * multi line comment documentation
     */

    1337;

  `)
  ).toMatchObject(buildExpectedASTOutput(1337));
});
