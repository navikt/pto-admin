import { fetchInstance, JobId } from './index';
import { graphqlPayload } from './graphql';

const veilarboppfolgingProxyUrl = (appPath: string) => `/api/veilarboppfolging/api/admin/veilarboppfolging${appPath}`;
const veilarboppfolgingV2ProxyUrl = (appPath: string) =>
	`/api/veilarboppfolging/api/v2/admin/veilarboppfolging${appPath}`;
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

export function republiserUtmeldingskandidat(oppfolgingsperiodeId: string): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingV2ProxyUrl('/republiser/utmeldingskandidat'), {
		oppfolgingsperiodeId
	});
}

export function republiserAktiveUtmeldingskandidater(): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingV2ProxyUrl('/republiser/utmeldingskandidater/aktive'));
}

export function batchAvsluttOppfolging(payload: { aktorIds: string[]; begrunnelse: string }): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/avsluttBrukere'), payload);
}

export function batchStartOppfolgingMedForrigeAoKontor(input: { aktorIdList: string[] }): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingV2ProxyUrl('/batch/start-oppfolging-med-forrige-kontor'), input);
}

export function batchKandidatForUtmelding(input: { oppfolgingsperiodeIder: string[] }): Promise<{ data: JobId }> {
	return fetchInstance.post(veilarboppfolgingV2ProxyUrl('/batch/opprett-utmeldingskandidater-ikke-lenger-arbeidssoker'), input);
}

export interface AvslutningsStatusDto {
	erArbeidssoeker: boolean;
	erDeltakerIUngdomsprogrammet: boolean;
	erIserv: boolean;
	harAap: boolean;
	harAktiveTiltaksdeltakelser: boolean;
	inaktiveringsDato: string | null;
	kanAvslutte: boolean;
	underKvp: boolean;
	underOppfolging: boolean;
}

export function hentAvslutningStatusForOppfolgingsperioder(payload: {
	oppfolgingsperiodeIder: string[];
}): Promise<Record<string, AvslutningsStatusDto | undefined>> {
	return fetchInstance
		.post<Record<string, AvslutningsStatusDto | undefined>>(veilarboppfolgingV2ProxyUrl('/avslutning-status'), {
			oppfolgingsperiodeIder: payload.oppfolgingsperiodeIder
		})
		.then(response => response.data);
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
		}>(veilarboppfolgingGraphqlUrl, graphqlPayload(graphqlQuery, payload.fnr))
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

const utmeldingskandidatQuery = `
	query hentUtmeldingskandidat($fnr: String!) {
		utmeldingskandidat(fnr: $fnr) {
			tag
			utmeldingskandidatHendelser {
				utfortAvType
				utfortAv
				hendelseTidspunkt
				type
				forlengetTil
			}
			aktivForlengelse {
				utfortAvType
				utfortAv
				hendelseTidspunkt
				forlengetTil
			}
		}
	}
`;

export interface UtmeldingskandidatDto {
	tag: string | null;
	utmeldingskandidatHendelser:
		| {
				utfortAvType: string;
				utfortAv: string | null;
				hendelseTidspunkt: string;
				type: string;
				forlengetTil: string | null;
		  }[]
		| null;
	aktivForlengelse: {
		utfortAvType: string;
		utfortAv: string | null;
		hendelseTidspunkt: string;
		forlengetTil: string | null;
	} | null;
}

export function hentUtmeldingskandidat(
	fnr: string
): Promise<{ data: { utmeldingskandidat: UtmeldingskandidatDto | null } }> {
	return fetchInstance
		.post<{
			data: { utmeldingskandidat: UtmeldingskandidatDto | null };
		}>(veilarboppfolgingGraphqlUrl, graphqlPayload(utmeldingskandidatQuery, fnr))
		.then(response => response.data);
}

export function republiserOppfolgingshendelse(aktorId: string): Promise<void> {
	return fetchInstance.post(veilarboppfolgingProxyUrl('/republiser/oppfolgingshendelse'), aktorId).then(() => {});
}
