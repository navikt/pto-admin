import { AxiosPromise } from 'axios';
import { axiosInstance, JobId } from './index';

export function republiserOppfolgingsperiodeForBruker(aktorId: string): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/republiser/oppfolgingsperioder`, {
		aktorId
	});
}

export function republiserTilordnetVeilederUtvalg(ids: string): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/veilarboppfolging/api/v2/admin/republiser/tilordnet-veileder/utvalg`, {
		aktorIder: ids.split(',').map(it => it.trim())
	});
}

export function batchAvsluttOppfolging(payload: { aktorIds: string[]; begrunnelse: string }): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/avsluttBrukere`, payload);
}

export function avsluttOppfolgingsperiode(payload: {
	aktorId: string;
	begrunnelse: string;
	oppfolgingsperiodeUuid: string;
}): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/veilarboppfolging/api/admin/veilarboppfolging/avsluttOppfolgingsperiode`, payload);
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
	return axiosInstance
		.post(`/api/veilarboppfolging/veilarboppfolging/api/graphql`, graphqlBody(payload.fnr))
		.then(response => response.data);
}
