declare module 'kebabcase-keys' {
	import { JsonPrimitive, KebabCase } from 'type-fest';

	type CustomJsonObject = { [Key in string]: CustomJsonValue } & {
		[Key in string]?: CustomJsonValue | undefined;
	};
	type CustomJsonValue = JsonPrimitive | object | CustomJsonObject | CustomJsonArray;
	type CustomJsonArray = CustomJsonValue[] | readonly CustomJsonValue[];

	type Options = {
		/**
		 * Recurse nested objects and objects in arrays.
		 * @default false
		 */
		readonly deep?: boolean;

		/**
		 * Exclude keys from being kebab-cased.
		 * @default []
		 */
		readonly exclude?: ReadonlyArray<string | RegExp>;
	};

	type KebabCasedProperties<T> = T extends readonly CustomJsonObject[]
		? {
				[Key in keyof T]: KebabCasedProperties<T[Key]>;
		  }
		: T extends CustomJsonObject
		? {
				[Key in keyof T as KebabCase<Key>]: T[Key] extends CustomJsonObject | CustomJsonObject[]
					? KebabCasedProperties<T[Key]>
					: T[Key];
		  }
		: T;

	declare function kebabcaseKeys<T extends CustomJsonObject | CustomJsonObject[]>(
		input: T,
		options?: Options
	): KebabCasedProperties<T>;

	export = kebabcaseKeys;
}
