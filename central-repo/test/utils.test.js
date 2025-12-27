import assert from 'node:assert/strict';
import {
  ensureValidProjectName,
  toPascalCase,
  toCamelCase,
  getContractClassName,
  getTestClassName,
} from '../src/utils.js';

describe('utils', function () {
  describe('ensureValidProjectName', function () {
    it('accepts valid names', () => {
      assert.strictEqual(ensureValidProjectName('my-project_1'), true);
    });

    it('rejects empty or invalid names', () => {
      assert.strictEqual(ensureValidProjectName(''), false);
      assert.strictEqual(ensureValidProjectName('has space'), false);
      assert.strictEqual(ensureValidProjectName('weird!name'), false);
    });
  });

  describe('toPascalCase / toCamelCase', function () {
    it('converts dashed and underscored strings', () => {
      assert.strictEqual(toPascalCase('basic-counter'), 'BasicCounter');
      assert.strictEqual(toPascalCase('multi_part name'), 'MultiPartName');
      assert.strictEqual(toCamelCase('basic-counter'), 'basicCounter');
    });
  });

  describe('class name helpers', function () {
    it('generates contract and test class names', () => {
      assert.strictEqual(getContractClassName('access-control'), 'AccessControl');
      assert.strictEqual(getTestClassName('access-control'), 'AccessControlTest');
    });
  });
});
