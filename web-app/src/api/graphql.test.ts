import { describe, expect, it } from 'vitest';
import { validateGraphqlResponse } from './graphql';

describe('validateGraphqlResponse', () => {
	it('returns successful data, including empty results', () => {
		const data = { oppfolgingsPerioder: [] };
		expect(validateGraphqlResponse({ data }, 'veilarboppfolging')).toEqual({ data });
		expect(validateGraphqlResponse({ data, errors: [] }, 'veilarboppfolging')).toEqual({ data });
	});

	it('preserves partial data alongside GraphQL errors', () => {
		const data = {
			perioder: [{ id: 'periode-1', aktiviteter: [{ id: 'aktivitet-1' }] }],
			tiltaksaktiviteter: null
		};
		expect(
			validateGraphqlResponse(
				{
					data,
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
		).toEqual({
			data,
			error: 'GraphQL-feil fra veilarbaktivitet:\nIkke tilgang - felt: tiltaksaktiviteter - FORBIDDEN'
		});
	});

	it('includes all errors and supports errors without optional details or data', () => {
		expect(
			validateGraphqlResponse(
				{ errors: [{ message: 'Ikke tilgang' }, { message: 'Ugyldig felt', path: ['perioder', 0, 'id'] }] },
				'veilarboppfolging'
			)
		).toEqual({
			data: null,
			error: 'GraphQL-feil fra veilarboppfolging:\nIkke tilgang\nUgyldig felt - felt: perioder.0.id'
		});
	});

	it.each([null, {}, { data: null }])('reports responses without data: %s', response => {
		expect(validateGraphqlResponse(response, 'veilarboppfolging')).toEqual({
			data: null,
			error: 'Mangler data i GraphQL-svaret fra veilarboppfolging.'
		});
	});
});
