import { fetchInstance, JobId } from './index';

const veilarboppfolgingProxyUrl = (appPath: string) => `/api/veilarboppfolging/api/admin/veilarboppfolging${appPath}`;
const veilarboppfolgingGraphqlUrl = `/api/veilarboppfolging/veilarboppfolging/api/graphql`;

export function republiserOppfolgingsperiodeForBruker(aktorId: string): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/republiser/oppfolgingsperioder'), {
		aktorId
	});
}

export function republiserTilordnetVeilederUtvalg(ids: string): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/republiser/tilordnet-veileder/utvalg'), {
		aktorIder: ids.split(',').map(it => it.trim())
	});
}

export function batchAvsluttOppfolging(payload: { aktorIds: string[]; begrunnelse: string }): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/avsluttBrukere'), payload);
}

export function avsluttOppfolgingsperiode(payload: {
	aktorId: string;
	begrunnelse: string;
	oppfolgingsperiodeUuid: string;
}): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/avsluttOppfolgingsperiode'), payload);
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
		}>(veilarboppfolgingGraphqlUrl, graphqlBody(payload.fnr))
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
		}>(veilarboppfolgingGraphqlUrl, {
			query: brukerStatusQuery,
			variables: { fnr }
		})
		.then(response => response.data);
}

export function republiserOppfolgingshendelse(aktorId: string): Promise<void> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/republiser/oppfolgingshendelse'), aktorId).then(() => {});
}
