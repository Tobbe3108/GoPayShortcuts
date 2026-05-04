import { describe, it, expect } from 'vitest';
import { myFn } from '../../src/lib/utils/myFn';

describe('myFn', () => {
  it('returns expected result for simple input', () => {
    expect(myFn(1)).toEqual('one');
  });
});
