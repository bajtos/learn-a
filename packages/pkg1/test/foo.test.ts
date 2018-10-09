import {fn} from '..';

describe('pkg1', () => {
  it('works', () => {
    fn();
  });

  it('fails', () => {
    throw new Error('expected test failure');
  });
})
