import kebabcaseKeys from 'kebabcase-keys';

// クラスのインスタンスをJSONのvalueにできるか？の確認用
class Point {
	x: number;

	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(point: Point) {
		return new Point(this.x + point.x, this.y + point.y);
	}
}

// 任意の型で定義したものをJSONのvalueにできるか？の確認用
type Person = {
	name: string;
	age: number;
};

const p1 = new Point(0, 10);
const person: Person = {
	name: 'John',
	age: 30
};
const symbol = Symbol('foo');

const result = kebabcaseKeys(
	{
		123: 123, // number,
		[symbol]: 'symbol', // symbol
		'space space': new Date(), // space space
		fooBar: new Date(), // camelCase(2 words)
		fooBarBar: new Date(), // camelCase(3 words)
		HogeBarBar: new Date(), // PascalCase(3 words)
		Hogehogehoge: new Date(), // Capitalize
		UPPERCASE: new Date(), // UPPERCASE
		testtesttest: new Date(), // lowercase
		foo_Foo_Foo: new Date(), // snake_case
		xxx_YYY_ZZZ: new Date(), // snake_case
		test_test_test: new Date(), // snake_case
		nested: {
			fooBar: new Date(),
			'kebabu-case': '' // kebab-case
		}
	},
	{ deep: true }
);
console.log(result['foo-bar']);
console.log(result.nested['kebabu-case']);
console.log(result.nested['foo-bar']);

const result2 = kebabcaseKeys(
	{
		fooBar: new Date(),
		hoge_hoge: new Error(''),
		person_test: person,
		point_test: p1
	},
	{ exclude: ['fooBar'] }
);
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
console.log((result2 as any).foo_bar);
console.log(result2['point-test'].x);

const result3 = kebabcaseKeys(
	[
		{ foo_bar: new Date() },
		{
			nested: {
				fooBaz: new Date(),
				hoge_hoge: new Error(''),
				arrayKey: ['123'],
				arrayJson: [{ testTest: new Date() }],
				person_test: person,
				point_test: p1
			}
		}
	],
	{ deep: true }
);
console.log(result3[0]?.['foo-bar']);
console.log(result3[0]?.nested?.['array-json'][0]?.['test-test'].getDate());
console.log(result3[0]?.nested?.['point-test'].x);

const result4 = kebabcaseKeys(
	{
		nested: {
			fooBaz: new Date(),
			hoge_hoge: new Error(''),
			arrayKey: ['123'],
			arrayJson: [{ testTest: new Date() }],
			person_test: person,
			point_test: p1
		}
	},
	{ deep: false } // 省略しても同じ結果になる
);
console.log(result4.nested.fooBaz.getDate());
