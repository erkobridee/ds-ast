import { Parser } from '~/parser';

describe('Parser', () => {
  it('execute', () => {
    const parser = new Parser();

    const input = `<?xml version="1.0" ?><book></book>`;

    const result = parser.parse(input);

    console.log(JSON.stringify(result, null, 2));
  });
});
