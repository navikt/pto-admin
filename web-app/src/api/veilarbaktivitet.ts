import { graphqlPayload } from './graphql';
import { axiosInstance } from './index';

interface PeriodeMedAktiviteter {
	id: string,
	aktiviteter: Aktivitet[],
}

export interface Aktivitet {
	id: string,
	funksjonellId: string,
	versjon: number,
	endretDato: string,
	opprettetDato: string,
	status: string,
	historisk: boolean,
	type: string,
}

const graphqlQuery = `
query hentAktiviteter($fnr: String!) {
	perioder(fnr: $fnr) {
		id
		aktiviteter {
			id
			funksjonellId
			versjon
			endretDato
			opprettetDato
			status
			historisk
			type
		}
	}
}
`

export function hentAktiviteter(payload: { fnr: string }): Promise<{ data: { perioder: PeriodeMedAktiviteter[] } }> {
	return axiosInstance.post(`/api/veilarbaktivitet/veilarbaktivitet/graphql`, graphqlPayload(graphqlQuery, payload.fnr))
		.then(response => response.data);
}
