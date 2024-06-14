import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

describe('Parser', () => {
  it('thow exception on empty source', () => {
    const parser = new Parser();

    expect(() => parser.parse()).toThrow('There is no source code to parse');

    expect(() => parser.parse(`a123abc`)).toThrow(/^Unexpected token: "/);
  });

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

  it('string', () => {
    const buildExpectedASTOutput = (value: string) =>
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(nodeFactory.StringLiteral(value)),
      ]);

    const parser = new Parser();

    expect(parser.parse(`'';`)).toMatchObject(buildExpectedASTOutput(''));
    expect(parser.parse(`'""';`)).toMatchObject(buildExpectedASTOutput('""'));
    expect(parser.parse(`'   ';`)).toMatchObject(buildExpectedASTOutput('   '));
    expect(parser.parse(`' 42 ';`)).toMatchObject(
      buildExpectedASTOutput(' 42 ')
    );
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

  it('statement list', () => {
    const buildExpectedASTOutput = (value: string) =>
      nodeFactory.Program([
        nodeFactory.ExpressionStatement(nodeFactory.StringLiteral(value)),
      ]);

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
});
