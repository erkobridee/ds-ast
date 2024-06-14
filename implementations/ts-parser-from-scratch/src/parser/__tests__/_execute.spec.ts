import Parser from '~/parser';

describe('Parser', () => {
  it('execute', () => {
    const parser = new Parser();

    // const program = `42`;
    // const program = `"42"`;
    // const program = `'42'`;
    // const program = `"hello"`;
    const program = `'hello'`;

    const ast = parser.parse(program);

    console.log('\n\n', JSON.stringify(ast, null, 2), '\n');
  });
});
