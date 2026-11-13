import { afterEach, describe, expect, it, vi } from 'vitest';
import { hentAktiviteter } from './veilarbaktivitet';
import { hentOppfolgingsperioder } from './veilarboppfolging';
import { hentDialoger } from './veilarbdialog';
import { hentBrukerdata } from './brukerdata';

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe.each([
	{ service: 'veilarboppfolging', fetchData: hentOppfolgingsperioder, field: 'oppfolgingsPerioder' },
	{ service: 'veilarbaktivitet', fetchData: hentAktiviteter, field: 'tiltaksaktiviteter' },
	{ service: 'veilarbdialog', fetchData: hentDialoger, field: 'dialoger' }
])('Brukerdata: $service', ({ service, fetchData, field }) => {
	it('returns GraphQL errors alongside data in HTTP 200 responses', async () => {
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

		await expect(fetchData({ fnr: 'test-ident' })).resolves.toEqual({
			data: { [field]: null },
			error: `GraphQL-feil fra ${service}:\nIkke tilgang - felt: ${field} - FORBIDDEN`
		});
	});

	describe('hentBrukerdata', () => {
		const periode = {
			id: 'periode-1',
			startTidspunkt: '2026-01-01T10:00:00Z',
			sluttTidspunkt: null,
			startetBegrunnelse: 'Test'
		};
		const aktivitet = { id: 'aktivitet-1' };
		const dialog = { id: 'dialog-1', oppfolgingsperiode: periode.id };
		const tiltaksaktivitet = { id: 'tiltak-1', oppfolgingsperiodeId: periode.id };

		function mockSvar({
			aktiviteter = Response.json({
				data: {
					perioder: [{ id: periode.id, aktiviteter: [aktivitet] }],
					tiltaksaktiviteter: [tiltaksaktivitet]
				}
			}),
			dialoger = Response.json({ data: { dialoger: [dialog] } }),
			perioder = Response.json({ data: { oppfolgingsPerioder: [periode] } })
		} = {}) {
			vi.stubGlobal(
				'fetch',
				vi.fn().mockImplementation((url: string) => {
					if (url.includes('/veilarbaktivitet/')) return Promise.resolve(aktiviteter);
					if (url.includes('/veilarbdialog/')) return Promise.resolve(dialoger);
					if (url.includes('/veilarboppfolging/')) return Promise.resolve(perioder);
					throw new Error(`Uventet URL: ${url}`);
				})
			);
		}

		it('preserves activities and dialogs when tiltaksaktiviteter fails', async () => {
			mockSvar({
				aktiviteter: Response.json({
					data: { perioder: [{ id: periode.id, aktiviteter: [aktivitet] }], tiltaksaktiviteter: null },
					errors: [{ message: 'Kunne ikke hente tiltak', path: ['tiltaksaktiviteter'] }]
				})
			});

			await expect(hentBrukerdata('test-ident')).resolves.toEqual({
				perioder: [{ ...periode, aktiviteter: [aktivitet], dialoger: [dialog], tiltaksAktiviteter: [] }],
				error: 'GraphQL-feil fra veilarbaktivitet:\nKunne ikke hente tiltak - felt: tiltaksaktiviteter'
			});
		});

		it('preserves tiltaksaktiviteter when perioder fails in the activity response', async () => {
			mockSvar({
				aktiviteter: Response.json({
					data: { perioder: null, tiltaksaktiviteter: [tiltaksaktivitet] },
					errors: [{ message: 'Kunne ikke hente aktiviteter', path: ['perioder'] }]
				})
			});

			const result = await hentBrukerdata('test-ident');
			expect(result.perioder).toEqual([
				{ ...periode, aktiviteter: [], dialoger: [dialog], tiltaksAktiviteter: [tiltaksaktivitet] }
			]);
			expect(result.error).toContain('Kunne ikke hente aktiviteter - felt: perioder');
		});

		it('preserves activities when the dialog request fails with an HTTP error', async () => {
			mockSvar({ dialoger: Response.json({ message: 'Ingen tilgang til dialoger' }, { status: 403 }) });
			vi.spyOn(console, 'error').mockImplementation(() => {});

			await expect(hentBrukerdata('test-ident')).resolves.toEqual({
				perioder: [
					{ ...periode, aktiviteter: [aktivitet], dialoger: [], tiltaksAktiviteter: [tiltaksaktivitet] }
				],
				error: 'Ingen tilgang til dialoger'
			});
		});

		it('reports all GraphQL errors without discarding other successful results', async () => {
			mockSvar({
				dialoger: Response.json({ data: null, errors: [{ message: 'Dialogfeil' }] }),
				aktiviteter: Response.json({ errors: [{ message: 'Aktivitetsfeil' }] })
			});

			await expect(hentBrukerdata('test-ident')).resolves.toEqual({
				perioder: [{ ...periode, aktiviteter: [], dialoger: [], tiltaksAktiviteter: [] }],
				error: 'GraphQL-feil fra veilarbdialog:\nDialogfeil\nGraphQL-feil fra veilarbaktivitet:\nAktivitetsfeil'
			});
		});

		it('returns all successful results without a warning', async () => {
			mockSvar();

			await expect(hentBrukerdata('test-ident')).resolves.toEqual({
				perioder: [
					{ ...periode, aktiviteter: [aktivitet], dialoger: [dialog], tiltaksAktiviteter: [tiltaksaktivitet] }
				],
				error: undefined
			});
		});
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
