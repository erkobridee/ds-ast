import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

it('string', () => {
  const buildExpectedASTOutput = (value: string) =>
    nodeFactory.Program([
      nodeFactory.ExpressionStatement(nodeFactory.StringLiteral(value)),
    ]);

  const parser = new Parser();

  expect(parser.parse(`'';`)).toMatchObject(buildExpectedASTOutput(''));
  expect(parser.parse(`'""';`)).toMatchObject(buildExpectedASTOutput('""'));
  expect(parser.parse(`'   ';`)).toMatchObject(buildExpectedASTOutput('   '));
  expect(parser.parse(`' 42 ';`)).toMatchObject(buildExpectedASTOutput(' 42 '));
  expect(parser.parse(`' 13 37 ';`)).toMatchObject(
    buildExpectedASTOutput(' 13 37 ')
  );

  expect(parser.parse(`"";`)).toMatchObject(buildExpectedASTOutput(''));
  expect(parser.parse(`"''";`)).toMatchObject(buildExpectedASTOutput("''"));
  expect(parser.parse(`"   ";`)).toMatchObject(buildExpectedASTOutput('   '));
  expect(parser.parse(`"42";`)).toMatchObject(buildExpectedASTOutput('42'));
  expect(parser.parse(`"13 37";`)).toMatchObject(
    buildExpectedASTOutput('13 37')
  );
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

    "13 37";

  `)
  ).toMatchObject(buildExpectedASTOutput('13 37'));
});
