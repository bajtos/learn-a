import {fn} from '..';

describe('pkg1', () => {
  it('works', () => {
    fn();
  });

  it.skip('fails', () => {
    throw new Error('expected test failure');
  });
})
