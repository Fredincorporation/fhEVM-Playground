import assert from 'node:assert/strict';

describe('Smoke test', function () {
  it('passes basic assertion', function () {
    assert.strictEqual(1 + 1, 2);
  });
});
