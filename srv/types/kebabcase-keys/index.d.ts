declare module 'kebabcase-keys' {
	import { JsonObject, KebabCase } from 'type-fest';

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

	type KebabCasedProperties<T> = T extends readonly JsonObject[]
		? {
				[Key in keyof T]: KebabCasedProperties<T[Key]>;
		  }
		: T extends JsonObject
		? {
				[Key in keyof T as KebabCase<Key>]: T[Key] extends JsonObject | JsonObject[]
					? KebabCasedProperties<T[Key]>
					: T[Key];
		  }
		: T;

	declare function kebabcaseKeys<T extends JsonObject | JsonObject[]>(
		input: T,
		options?: Options
	): KebabCasedProperties<T>;

	export = kebabcaseKeys;
}
