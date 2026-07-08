import { fetchInstance, JobId } from './index';

export function republiserOppfolgingsperiodeForBruker(aktorId: string): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/republiser/oppfolgingsperioder`, {
		aktorId
	});
}

export function republiserTilordnetVeilederUtvalg(ids: string): Promise<{ data: JobId }> {
	return fetchInstance.post(
		`/api/veilarboppfolging/api/admin/veilarboppfolging/republiser/tilordnet-veileder/utvalg`,
		{
			aktorIder: ids.split(',').map(it => it.trim())
		}
	);
}

export function batchAvsluttOppfolging(payload: { aktorIds: string[]; begrunnelse: string }): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/avsluttBrukere`, payload);
}

export function avsluttOppfolgingsperiode(payload: {
	aktorId: string;
	begrunnelse: string;
	oppfolgingsperiodeUuid: string;
}): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/avsluttOppfolgingsperiode`, payload);
}

const graphqlQuery = `
	query hentOppfolgingsperioder($fnr: String!) {
		oppfolgingsPerioder(fnr: $fnr) {
			startTidspunkt
			sluttTidspunkt
			id
			startetBegrunnelse
		}
	}
`;

const graphqlBody = (fnr: string) => ({
	query: graphqlQuery,
	variables: { fnr }
});

interface OppfolgingsPeriode {
	startTidspunkt: string;
	sluttTidspunkt: string;
	id: string;
	startetBegrunnelse: string | undefined;
}

export function hentOppfolgingsperioder(payload: {
	fnr: string;
}): Promise<{ data: { oppfolgingsPerioder: OppfolgingsPeriode[] } }> {
	return fetchInstance
		.post<{
			data: { oppfolgingsPerioder: OppfolgingsPeriode[] };
		}>(`/api/veilarboppfolging/veilarboppfolging/api/graphql`, graphqlBody(payload.fnr))
		.then(response => response.data);
}

const brukerStatusQuery = `
	query hentBrukerStatus($fnr: String!) {
		brukerStatus(fnr: $fnr) {
			manuell {
				erManuell
				opprettetTidspunkt
				begrunnelse
				endretAvType
				endretAvIdent
			}
			erKontorsperret
			kontorSperre {
				kontorId
			}
			krr {
				reservertIKrr
				kanVarsles
				registrertIKrr
			}
		}
	}
`;

export interface BrukerStatusDto {
	manuell: {
		erManuell: boolean | null;
		opprettetTidspunkt: string | null;
		begrunnelse: string | null;
		endretAvType: string | null;
		endretAvIdent: string | null;
	} | null;
	erKontorsperret: boolean;
	kontorSperre: {
		kontorId: string;
	} | null;
	krr: {
		reservertIKrr: boolean;
		kanVarsles: boolean;
		registrertIKrr: boolean;
	};
}

export function hentBrukerStatus(fnr: string): Promise<{ data: { brukerStatus: BrukerStatusDto } }> {
	return fetchInstance
		.post<{
			data: { brukerStatus: BrukerStatusDto };
		}>(`/api/veilarboppfolging/veilarboppfolging/api/graphql`, {
			query: brukerStatusQuery,
			variables: { fnr }
		})
		.then(response => response.data);
}
