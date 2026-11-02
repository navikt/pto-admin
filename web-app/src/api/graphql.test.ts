import { describe, expect, it } from 'vitest';
import { validateGraphqlResponse } from './graphql';

describe('validateGraphqlResponse', () => {
	it('returns successful data, including empty results', () => {
		const data = { oppfolgingsPerioder: [] };
		expect(validateGraphqlResponse({ data }, 'veilarboppfolging')).toEqual({ data });
		expect(validateGraphqlResponse({ data, errors: [] }, 'veilarboppfolging')).toEqual({ data });
	});

	it('rejects GraphQL errors even when partial data is returned', () => {
		expect(() =>
			validateGraphqlResponse(
				{
					data: { perioder: [], tiltaksaktiviteter: null },
					errors: [
						{
							message: 'Ikke tilgang',
							path: ['tiltaksaktiviteter'],
							extensions: { classification: 'FORBIDDEN' }
						}
					]
				},
				'veilarbaktivitet'
			)
		).toThrow('GraphQL-feil fra veilarbaktivitet:\nIkke tilgang - felt: tiltaksaktiviteter - FORBIDDEN');
	});

	it('includes all errors and supports errors without optional details or data', () => {
		expect(() =>
			validateGraphqlResponse(
				{ errors: [{ message: 'Ikke tilgang' }, { message: 'Ugyldig felt', path: ['perioder', 0, 'id'] }] },
				'veilarboppfolging'
			)
		).toThrow('GraphQL-feil fra veilarboppfolging:\nIkke tilgang\nUgyldig felt - felt: perioder.0.id');
	});

	it.each([null, {}, { data: null }])('rejects responses without data: %s', response => {
		expect(() => validateGraphqlResponse(response, 'veilarboppfolging')).toThrow(
			'Mangler data i GraphQL-svaret fra veilarboppfolging.'
		);
	});
});
