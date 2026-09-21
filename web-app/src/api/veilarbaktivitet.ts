import { graphqlPayload } from './graphql';
import { fetchInstance } from './index';

interface PeriodeMedAktiviteter {
	id: string;
	aktiviteter: Aktivitet[];
}

export interface Aktivitet {
	id: string;
	funksjonellId: string;
	versjon: number;
	endretDato: string;
	opprettetDato: string;
	status: string;
	historisk: boolean;
	type: string;
	eksternAktivitet: {
		type: string;
	};
}

export interface AktivitetDto {
	funksjonellId: string | null;
}

export interface TiltaksAktivitet {
	id: string;
	status: string;
	type: string;
	fraDato: string;
	tilDato: string;
	opprettetDato: string;
	avtalt: boolean;
	oppfolgingsperiodeId: string;
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
			eksternAktivitet {
				type
			}
		}
	}
	tiltaksaktiviteter(fnr: $fnr) {
		id
		status
		type
		fraDato
		tilDato
		opprettetDato
		avtalt
		oppfolgingsperiodeId
	}
}
`;

const aktivitetQuery = `
query hentAktivitet($aktivitetId: String!, $versjon: String) {
	aktivitet(aktivitetId: $aktivitetId, versjon: $versjon) {
		funksjonellId
	}
}
`;

export function hentAktiviteter(payload: {
	fnr: string;
}): Promise<{ data: { perioder: PeriodeMedAktiviteter[]; tiltaksaktiviteter: TiltaksAktivitet[] } }> {
	return fetchInstance
		.post<{
			data: { perioder: PeriodeMedAktiviteter[]; tiltaksaktiviteter: TiltaksAktivitet[] };
		}>(`/api/veilarbaktivitet/veilarbaktivitet/graphql`, graphqlPayload(graphqlQuery, payload.fnr))
		.then(response => response.data);
}

export function hentAktivitet(payload: {
	aktivitetId: string;
	versjon?: string;
}): Promise<{ data: { aktivitet: AktivitetDto | null } }> {
	return fetchInstance
		.post<{
			data: { aktivitet: AktivitetDto | null };
		}>(
			`/api/veilarbaktivitet/veilarbaktivitet/graphql`,
			graphqlPayload(aktivitetQuery, {
				aktivitetId: payload.aktivitetId,
				versjon: payload.versjon ?? null
			})
		)
		.then(response => response.data);
}

export function flyttAktiviteterTilSistePeriode(payload: {
	aktorIds: string[];
}): Promise<{ data: Record<string, number> }> {
	return fetchInstance
		.post<{ data: Record<string, number> }>(
			`/api/veilarbaktivitet/admin/flytt-aktiviteter-til-siste-periode`,
			payload
		)
		.then(response => response.data);
}
