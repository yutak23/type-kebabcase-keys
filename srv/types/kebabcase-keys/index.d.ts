declare module 'kebabcase-keys' {
	import { JsonPrimitive, KebabCase } from 'type-fest';

	type CustomJsonObject = { [Key in string]: CustomJsonValue } & {
		[Key in string]?: CustomJsonValue | undefined;
	};
	type CustomJsonValue = JsonPrimitive | object | CustomJsonObject | CustomJsonArray;
	type CustomJsonArray = CustomJsonValue[] | readonly CustomJsonValue[];

	/**
	 * Return a default type if input type is nil.
	 * @template T - Input type.
	 * @template U - Default type.
	 */
	type WithDefault<T, U extends T> = T extends undefined | null ? U : T;

	interface Options {
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
	}

	type KebabCasedProperties<T, Deep extends boolean = false> = T extends readonly CustomJsonObject[]
		? {
				[Key in keyof T]: KebabCasedProperties<T[Key], Deep>;
		  }
		: T extends CustomJsonObject
		? {
				[Key in keyof T as KebabCase<Key>]: T[Key] extends CustomJsonObject | CustomJsonObject[]
					? Deep[] extends Array<true>
						? KebabCasedProperties<T[Key], Deep>
						: T[Key]
					: T[Key];
		  }
		: T;

	/**
	 * Convert object keys to kebabcase.
	 * @param input - Object or array of objects to snake-case.
	 * @param options - Options of conversion.
	 */
	declare function kebabcaseKeys<
		T extends CustomJsonObject | CustomJsonObject[],
		OptionsType extends Options
	>(
		input: T,
		options?: OptionsType
	): KebabCasedProperties<T, WithDefault<OptionsType['deep'], false>>;

	export = kebabcaseKeys;
}
