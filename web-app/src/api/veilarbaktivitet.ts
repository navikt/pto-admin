import { graphqlPayload } from './graphql';
import { fetchInstance } from './index';

interface PeriodeMedAktiviteter {
	id: string;
	aktiviteter: Aktivitet[];
}

export interface Aktivitet {
	id: string;
	funksjonellId: string;
	portefoljeKafkaOffsetAiven?: number;
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

export const DEFAULT_AKTIVITET_FELTER = [
	'id',
	'funksjonellId',
	'versjon',
	'endretDato',
	'opprettetDato',
	'status',
	'historisk',
	'type',
	'eksternAktivitet.type'
];

interface SelectionTree {
	[key: string]: SelectionTree | true;
}

const leggTilFelt = (tree: SelectionTree, felt: string) => {
	const deler = felt.split('.').filter(Boolean);
	let currentTree = tree;

	deler.forEach((del, index) => {
		const erSiste = index === deler.length - 1;
		if (erSiste) {
			currentTree[del] = true;
			return;
		}

		const existing = currentTree[del];
		if (!existing || existing === true) {
			currentTree[del] = {};
		}

		currentTree = currentTree[del] as SelectionTree;
	});
};

const byggUtvalg = (tree: SelectionTree, indent = 2): string => {
	const pad = '\t'.repeat(indent);
	return Object.entries(tree)
		.map(([felt, verdi]) => {
			if (verdi === true) {
				return `${pad}${felt}`;
			}

			return `${pad}${felt} {\n${byggUtvalg(verdi, indent + 1)}\n${pad}}`;
		})
		.join('\n');
};

const graphqlQuery = (aktivitetFelter: string[]) => {
	const tree: SelectionTree = {};
	aktivitetFelter.forEach(felt => leggTilFelt(tree, felt));

	return `
query hentAktiviteter($fnr: String!) {
	perioder(fnr: $fnr) {
		id
		aktiviteter {
${byggUtvalg(tree)}
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
};

const aktivitetQuery = (aktivitetFelter: string[]) => `
query hentAktivitet($aktivitetId: String!, $versjon: String) {
	aktivitet(aktivitetId: $aktivitetId, versjon: $versjon) {
${byggUtvalg(aktivitetFelter.reduce<SelectionTree>((tree, felt) => {
		leggTilFelt(tree, felt);
		return tree;
	}, {}))}
	}
}
`;

export function hentAktiviteter(payload: {
	fnr: string;
	aktivitetFelter?: string[];
}): Promise<{ data: { perioder: PeriodeMedAktiviteter[]; tiltaksaktiviteter: TiltaksAktivitet[] } }> {
	const query = graphqlQuery(payload.aktivitetFelter ?? DEFAULT_AKTIVITET_FELTER);
	return fetchInstance
		.post<{
			data: { perioder: PeriodeMedAktiviteter[]; tiltaksaktiviteter: TiltaksAktivitet[] };
		}>(`/api/veilarbaktivitet/veilarbaktivitet/graphql`, graphqlPayload(query, payload.fnr))
		.then(response => response.data);
}

export function hentAktivitet(payload: {
	aktivitetId: string;
	versjon?: string;
	aktivitetFelter?: string[];
}): Promise<{ data: { aktivitet: Aktivitet | null } }> {
	const query = aktivitetQuery(payload.aktivitetFelter ?? DEFAULT_AKTIVITET_FELTER);
	return fetchInstance
		.post<{
			data: { aktivitet: Aktivitet | null };
		}>(
			`/api/veilarbaktivitet/veilarbaktivitet/graphql`,
			graphqlPayload(query, {
				aktivitetId: payload.aktivitetId,
				versjon: payload.versjon ?? null
			})
		)
		.then(response => response.data);
}

export function flyttAktiviteterTilSistePeriode(payload: { aktorIds: string[] }): Promise<Record<string, number>> {
	return fetchInstance
		.post<
			Record<string, number>
		>(`/api/veilarbaktivitet/veilarbaktivitet/admin/flytt-aktiviteter-til-siste-periode`, payload)
		.then(response => response.data);
}
