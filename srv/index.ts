import kebabcaseKeys from 'kebabcase-keys';

const result = kebabcaseKeys({
	foo_bar: 'baz',
	nested: { fooBaz: 'bar', arrayKey: ['123'], arrayJson: [{ testTest: 'test' }] }
});
console.log(result['foo-bar']);

const result2 = kebabcaseKeys([
	{ foo_bar: 'baz' },
	{ nested: { fooBaz: 'bar', arrayKey: ['123'], arrayJson: [{ testTest: 'test' }] } }
]);
console.log(result2[0]?.['foo-bar']);
