import { countLines, truncate } from '~/utils/text';

describe('text', () => {
  describe('count text lines', () => {
    it('single line', () => {
      const text = ``;
      expect(countLines(text)).toBe(1);
    });

    it('multiple lines', () => {
      let lines = countLines(`a

another value

12312


ggasqe`);
      expect(lines).toBe(8);

      lines = countLines(`<!-- 
  hello 
    world 
      -->`);

      expect(lines).toBe(4);
    });
  });

  describe('truncate text', () => {
    it('short text', () => {
      const text = `hello world`;
      expect(truncate(text, 20)).toBe(text);
    });

    it('long text', () => {
      const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt.`;
      const expected = `Lorem ipsum dolor sit amet, consectetur adipiscing…`;
      expect(truncate(text)).toBe(expected);
    });
  });
});
