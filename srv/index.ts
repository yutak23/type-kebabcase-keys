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

const result = kebabcaseKeys(
	{
		fooBar: new Date(),
		hoge_hoge: new Error(''),
		person_test: person,
		point_test: p1
	},
	{ exclude: ['fooBar'] }
);
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
console.log((result as any).foo_bar);
console.log(result['point-test'].x);

const result2 = kebabcaseKeys(
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
console.log(result2[0]?.['foo-bar']);
console.log(result2[0]?.nested?.['array-json'][0]?.['test-test'].getDate());
console.log(result2[0]?.nested?.['point-test'].x);

const result3 = kebabcaseKeys(
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
console.log(result3.nested.fooBaz.getDate());
