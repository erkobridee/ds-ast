import { Parser } from '~/parser';
import { nodeFactory } from '~/parser/AST';

describe('block statement', () => {
  it('empty statement', () => {
    const parser = new Parser();

    expect(
      parser.parse(`
        
        ;

      `)
    ).toMatchObject(nodeFactory.Program([nodeFactory.EmptyStatement()]));
  });

  it('empty block statement', () => {
    const parser = new Parser();

    const emptyBlockStatementAST = nodeFactory.Program([
      nodeFactory.BlockStatement([]),
    ]);

    expect(
      parser.parse(`
      
      {}
  
    `)
    ).toMatchObject(emptyBlockStatementAST);

    expect(
      parser.parse(`
      
      {
        
      }
  
    `)
    ).toMatchObject(emptyBlockStatementAST);
  });

  it('simple statement', () => {
    const parser = new Parser();

    expect(
      parser.parse(`
      
      {
        42;
        
        'hello world';
      }
  
    `)
    ).toMatchObject(
      nodeFactory.Program([
        nodeFactory.BlockStatement([
          nodeFactory.ExpressionStatement(nodeFactory.NumericLiteral(42)),
          nodeFactory.ExpressionStatement(
            nodeFactory.StringLiteral('hello world')
          ),
        ]),
      ])
    );
  });

  it('inner simple statement', () => {
    const parser = new Parser();

    expect(
      parser.parse(`
      
      {{
        42;
        
        'hello world';
      }}
  
    `)
    ).toMatchObject(
      nodeFactory.Program([
        nodeFactory.BlockStatement([
          nodeFactory.BlockStatement([
            nodeFactory.ExpressionStatement(nodeFactory.NumericLiteral(42)),
            nodeFactory.ExpressionStatement(
              nodeFactory.StringLiteral('hello world')
            ),
          ]),
        ]),
      ])
    );
  });
});
