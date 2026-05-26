import * as v from 'valibot';

const nonNegativeNumber = v.pipe(v.number(), v.minValue(0));

const sixTuple = v.tuple([
	nonNegativeNumber,
	nonNegativeNumber,
	nonNegativeNumber,
	nonNegativeNumber,
	nonNegativeNumber,
	nonNegativeNumber,
]);

const buyCard = v.object({
	type: v.literal('BUY_CARD'),
	data: v.object({
		row: v.picklist(['high', 'middle', 'low', 'reserve']),
		i: v.number(),
		card: v.number(),
		tokens: sixTuple,
		person: v.optional(
			v.object({
				id: v.number(),
			})
		),
	}),
});

const tokens = v.union([
	v.tuple([v.number(), v.number(), v.number()]),
	v.tuple([v.number(), v.number()]),
	v.tuple([v.number()]),
]);

const takeTokens = v.object({
	type: v.literal('TAKE_TOKENS'),
	data: v.object({
		tokens: tokens,
		returned: v.optional(tokens),
	}),
});

const reserve = v.object({
	type: v.literal('RESERVE'),
	data: v.object({
		row: v.picklist(['high', 'middle', 'low']),
		i: v.number(),
		card: v.number(),
		returnToken: v.optional(v.number()),
	}),
});

export const actionSchema = v.union([buyCard, takeTokens, reserve]);
