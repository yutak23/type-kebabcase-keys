declare module 'kebabcase-keys' {
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

	// based on https://github.com/DefinitelyTyped/DefinitelyTyped/pull/59806#pullrequestreview-942584759
	// Copied from https://github.com/sindresorhus/type-fest

	/**
	Matches any valid JSON primitive value.
	
	@category JSON
	*/
	type JsonPrimitive = string | number | boolean | null;

	/**
	Convert a string literal to kebab-case.
	
	This can be useful when, for example, converting a camel-cased object property to a kebab-cased CSS class name or a command-line flag.
	
	@example
	```
	import type {KebabCase} from 'type-fest';
	
	// Simple
	
	const someVariable: KebabCase<'fooBar'> = 'foo-bar';
	
	// Advanced
	
	type KebabCasedProperties<T> = {
		[K in keyof T as KebabCase<K>]: T[K]
	};
	
	interface CliOptions {
		dryRun: boolean;
		includeFile: string;
		foo: number;
	}
	
	const rawCliOptions: KebabCasedProperties<CliOptions> = {
		'dry-run': true,
		'include-file': 'bar.js',
		foo: 123
	};
	```
	
	@category Change case
	@category Template literal
	*/
	type KebabCase<Value> = DelimiterCase<Value, '-'>;

	// Transforms a string that is fully uppercase into a fully lowercase version. Needed to add support for SCREAMING_SNAKE_CASE, see https://github.com/sindresorhus/type-fest/issues/385
	type UpperCaseToLowerCase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T;

	// This implementation does not support SCREAMING_SNAKE_CASE, it is used internally by `SplitIncludingDelimiters`.
	// eslint-disable-next-line @typescript-eslint/naming-convention
	type SplitIncludingDelimiters_<
		Source extends string,
		Delimiter extends string
	> = Source extends ''
		? []
		: Source extends `${infer FirstPart}${Delimiter}${infer SecondPart}`
		? Source extends `${FirstPart}${infer UsedDelimiter}${SecondPart}`
			? UsedDelimiter extends Delimiter
				? // eslint-disable-next-line @typescript-eslint/no-shadow
				  Source extends `${infer FirstPart}${UsedDelimiter}${infer SecondPart}`
					? [
							...SplitIncludingDelimiters<FirstPart, Delimiter>,
							UsedDelimiter,
							...SplitIncludingDelimiters<SecondPart, Delimiter>
					  ]
					: never
				: never
			: never
		: [Source];

	/**
	Unlike a simpler split, this one includes the delimiter splitted on in the resulting array literal. This is to enable splitting on, for example, upper-case characters.
	
	@category Template literal
	*/
	type SplitIncludingDelimiters<
		Source extends string,
		Delimiter extends string
	> = SplitIncludingDelimiters_<UpperCaseToLowerCase<Source>, Delimiter>;

	/**
	Format a specific part of the splitted string literal that `StringArrayToDelimiterCase<>` fuses together, ensuring desired casing.
	
	@see StringArrayToDelimiterCase
	*/
	type StringPartToDelimiterCase<
		StringPart extends string,
		Start extends boolean,
		UsedWordSeparators extends string,
		UsedUpperCaseCharacters extends string,
		Delimiter extends string
	> = StringPart extends UsedWordSeparators
		? Delimiter
		: Start extends true
		? Lowercase<StringPart>
		: StringPart extends UsedUpperCaseCharacters
		? `${Delimiter}${Lowercase<StringPart>}`
		: StringPart;

	/**
	Takes the result of a splitted string literal and recursively concatenates it together into the desired casing.
	
	It receives `UsedWordSeparators` and `UsedUpperCaseCharacters` as input to ensure it's fully encapsulated.
	
	@see SplitIncludingDelimiters
	*/
	type StringArrayToDelimiterCase<
		Parts extends readonly any[],
		Start extends boolean,
		UsedWordSeparators extends string,
		UsedUpperCaseCharacters extends string,
		Delimiter extends string
	> = Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
		? `${StringPartToDelimiterCase<
				FirstPart,
				Start,
				UsedWordSeparators,
				UsedUpperCaseCharacters,
				Delimiter
		  >}${StringArrayToDelimiterCase<
				RemainingParts,
				false,
				UsedWordSeparators,
				UsedUpperCaseCharacters,
				Delimiter
		  >}`
		: Parts extends [string]
		? string
		: '';

	/**
	Convert a string literal to a custom string delimiter casing.
	
	This can be useful when, for example, converting a camel-cased object property to an oddly cased one.
	
	@see KebabCase
	@see SnakeCase
	
	@example
	```
	import type {DelimiterCase} from 'type-fest';
	
	// Simple
	
	const someVariable: DelimiterCase<'fooBar', '#'> = 'foo#bar';
	
	// Advanced
	
	type OddlyCasedProperties<T> = {
		[K in keyof T as DelimiterCase<K, '#'>]: T[K]
	};
	
	interface SomeOptions {
		dryRun: boolean;
		includeFile: string;
		foo: number;
	}
	
	const rawCliOptions: OddlyCasedProperties<SomeOptions> = {
		'dry#run': true,
		'include#file': 'bar.js',
		foo: 123
	};
	```
	
	@category Change case
	@category Template literal
	*/
	type DelimiterCase<Value, Delimiter extends string> = string extends Value
		? Value
		: Value extends string
		? StringArrayToDelimiterCase<
				SplitIncludingDelimiters<Value, WordSeparators | UpperCaseCharacters>,
				true,
				WordSeparators,
				UpperCaseCharacters,
				Delimiter
		  >
		: Value;

	type UpperCaseCharacters =
		| 'A'
		| 'B'
		| 'C'
		| 'D'
		| 'E'
		| 'F'
		| 'G'
		| 'H'
		| 'I'
		| 'J'
		| 'K'
		| 'L'
		| 'M'
		| 'N'
		| 'O'
		| 'P'
		| 'Q'
		| 'R'
		| 'S'
		| 'T'
		| 'U'
		| 'V'
		| 'W'
		| 'X'
		| 'Y'
		| 'Z';

	type WordSeparators = '-' | '_' | Whitespace;

	type Whitespace =
		| '\u{9}' // '\t'
		| '\u{A}' // '\n'
		| '\u{B}' // '\v'
		| '\u{C}' // '\f'
		| '\u{D}' // '\r'
		| '\u{20}' // ' '
		| '\u{85}'
		| '\u{A0}'
		| '\u{1680}'
		| '\u{2000}'
		| '\u{2001}'
		| '\u{2002}'
		| '\u{2003}'
		| '\u{2004}'
		| '\u{2005}'
		| '\u{2006}'
		| '\u{2007}'
		| '\u{2008}'
		| '\u{2009}'
		| '\u{200A}'
		| '\u{2028}'
		| '\u{2029}'
		| '\u{202F}'
		| '\u{205F}'
		| '\u{3000}'
		| '\u{FEFF}';
}
