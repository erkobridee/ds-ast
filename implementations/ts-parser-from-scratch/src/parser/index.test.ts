import { greetings } from '~/parser';

describe('Parser', () => {
  it('greetings', () => {
    expect(greetings).toBe('Hello Parser!');
  });
});
