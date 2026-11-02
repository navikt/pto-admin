import { afterEach, describe, expect, it, vi } from 'vitest';
import { hentAktiviteter } from './veilarbaktivitet';
import { hentOppfolgingsperioder } from './veilarboppfolging';
import { hentDialoger } from './veilarbdialog';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe.each([
	{ service: 'veilarboppfolging', fetchData: hentOppfolgingsperioder, field: 'oppfolgingsPerioder' },
	{ service: 'veilarbaktivitet', fetchData: hentAktiviteter, field: 'tiltaksaktiviteter' },
	{ service: 'veilarbdialog', fetchData: hentDialoger, field: 'dialoger' }
])('Brukerdata: $service', ({ service, fetchData, field }) => {
	it('rejects GraphQL errors in HTTP 200 responses', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				Response.json({
					data: { [field]: null },
					errors: [
						{
							message: 'Ikke tilgang',
							locations: [{ line: 19, column: 2 }],
							path: [field],
							extensions: { classification: 'FORBIDDEN' }
						}
					]
				})
			)
		);

		await expect(fetchData({ fnr: 'test-ident' })).rejects.toThrow(
			`GraphQL-feil fra ${service}:\nIkke tilgang - felt: ${field} - FORBIDDEN`
		);
	});

	it('preserves successful results', async () => {
		const result = { data: { [field]: [] } };
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(result)));

		await expect(fetchData({ fnr: 'test-ident' })).resolves.toEqual(result);
	});

	it('propagates HTTP errors', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ message: 'Ikke tilgang' }, { status: 403 })));

		await expect(fetchData({ fnr: 'test-ident' })).rejects.toThrow('Ikke tilgang');
	});
});
