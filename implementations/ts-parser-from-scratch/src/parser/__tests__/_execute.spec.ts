import Parser from '~/parser';

describe('Parser', () => {
  it('execute', () => {
    const parser = new Parser();

    const program = `42`;

    const ast = parser.parse(program);

    console.log('\n\n', JSON.stringify(ast, null, 2), '\n');
  });
});
