import { GraphqlResult } from './graphql';
import { DEFAULT_AKTIVITET_FELTER, hentAktiviteter } from './veilarbaktivitet';
import { hentDialoger } from './veilarbdialog';
import { hentOppfolgingsperioder } from './veilarboppfolging';

function lesResultat<T>(result: PromiseSettledResult<GraphqlResult<T>>): GraphqlResult<T> {
	if (result.status === 'fulfilled') {
		return result.value;
	}
	console.error(result.reason);
	return {
		data: null,
		error:
			result.reason instanceof Error ? result.reason.message : 'En ukjent feil oppstod ved henting av brukerdata.'
	};
}

export async function hentBrukerdata(fnr: string, aktivitetFelter: string[] = DEFAULT_AKTIVITET_FELTER) {
	const resultater = await Promise.allSettled([
		hentDialoger({ fnr }),
		hentOppfolgingsperioder({ fnr }),
		hentAktiviteter({ fnr, aktivitetFelter })
	]);
	const dialogerResultat = lesResultat(resultater[0]);
	const perioderResultat = lesResultat(resultater[1]);
	const aktiviteterResultat = lesResultat(resultater[2]);
	const error = [dialogerResultat.error, perioderResultat.error, aktiviteterResultat.error]
		.filter(Boolean)
		.join('\n');
	const dialoger = dialogerResultat.data?.dialoger ?? [];
	const perioderMedAktiviteter = aktiviteterResultat.data?.perioder ?? [];
	const tiltaksAktiviteter = aktiviteterResultat.data?.tiltaksaktiviteter ?? [];
	const perioder = (perioderResultat.data?.oppfolgingsPerioder ?? [])
		.map(periode => ({
			...periode,
			dialoger: dialoger.filter(dialog => dialog.oppfolgingsperiode === periode.id),
			aktiviteter:
				perioderMedAktiviteter.find(periodeMedAktiviteter => periodeMedAktiviteter.id === periode.id)
					?.aktiviteter ?? [],
			tiltaksAktiviteter
		}))
		.sort((a, b) => new Date(b.startTidspunkt).getTime() - new Date(a.startTidspunkt).getTime());
	return { perioder, error: error || undefined };
}
