import { AdminDataForBrukerRequest, AdminDataTypeResponse } from '../view/veilarbportefolje/veilarbportefolje';

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<{ data: T }> {
	const headers: Record<string, string> = {
		'Nav-Consumer-Id': 'poao-admin',
		...(options.headers as Record<string, string>)
	};
	if (options.body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}
	const response = await fetch(url, {
		credentials: 'include',
		...options,
		headers
	});
	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
	}
	const data: T = await response.json();
	return { data };
}

export const fetchInstance = {
	get: <T>(url: string) => apiFetch<T>(url),
	post: <T>(url: string, body?: unknown) =>
		apiFetch<T>(url, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
	put: <T>(url: string, body?: unknown) =>
		apiFetch<T>(url, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
	delete: async (url: string): Promise<void> => {
		const response = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Nav-Consumer-Id': 'poao-admin' }
		});
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
		}
	}
};

interface AktorIdResponse {
	aktorId: string;
}

interface FnrResponse {
	fnr: string;
}

export interface Ident {
	ident: string;
	historisk: boolean;
	gruppe: string;
}

type AlleIdenterResponse = Ident[];

interface TilgangResponse {
	harTilgang: boolean;
}

export interface User {
	navn: string;
}

export function me(): Promise<{ data: User }> {
	return fetchInstance.get(`/api/auth/me`);
}

export type JobId = string;

// Hovedside

export function fnrTilAktorId(fnr: string): Promise<{ data: AktorIdResponse }> {
	return fetchInstance.post(`/api/v2/ident/hent-aktorId`, { fnr });
}

export function aktorIdTilFnr(aktorId: string): Promise<{ data: FnrResponse }> {
	return fetchInstance.post(`/api/v2/ident/hent-fnr`, { aktorId });
}

export function hentIdenter(eksternBrukerId: string): Promise<{ data: AlleIdenterResponse }> {
	return fetchInstance.post(`/api/v2/ident/hent-identer`, { eksternBrukerId });
}

export function sjekkHarTilgangTilEnhet(navIdent: string, enhetId: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.get(`/api/tilgang/enhet?navIdent=${navIdent}&enhetId=${enhetId}`);
}

export function sjekkHarSkrivetilgang(navIdent: string, norskIdent: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.post(`/api/v2/tilgang/hent-skriv`, { navIdent, norskIdent });
}

export function sjekkHarLesetilgang(navIdent: string, norskIdent: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.post(`/api/v2/tilgang/hent-les`, { navIdent, norskIdent });
}

export function sjekkHarTilgangTilKode6(navIdent: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.get(`/api/tilgang/kode6?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilKode7(navIdent: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.get(`/api/tilgang/kode7?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilEgenAnsatt(navIdent: string): Promise<{ data: TilgangResponse }> {
	return fetchInstance.get(`/api/tilgang/skjermet?navIdent=${navIdent}`);
}

export function slett14avedtak(
	journalpostId: string,
	fnr: string,
	ansvarligVeileder: string,
	slettVedtakBestillingId: string
) {
	return fetchInstance.put(`/api/admin/veilarbvedtaksstotte/slett-vedtak`, {
		journalpostId,
		fnr,
		ansvarligVeileder,
		slettVedtakBestillingId
	});
}

// Republisering vedtaksstøtte

export function republiserSiste14aVedtak(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbvedtaksstotte/republiser/siste-14a-vedtak`);
}

export function republiserVedtak14aFattetDvh(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbvedtaksstotte/republiser/vedtak-14a-fattet-dvh`);
}

// Republisering veilarbdialog

export function republiserEndringPaaDialog(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbdialog/republiser/endring-paa-dialog`);
}

// Republisering veilarbarena

export function republiserEndringPaaOppfolgingsbrukere(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbarena/republiser/endring-pa-bruker/all`);
}

export function republiserEndringPaaOppfolgingsbruker(fnr: string): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbarena/republiser/endring-pa-bruker`, {
		fnrs: fnr.split(',').map(f => f.trim())
	});
}

// Veilarbportefolje admin-funksjoner
export function indekserAktoer(aktorId: string): Promise<{ data: string }> {
	return fetchInstance.put(`/api/admin/veilarbportefolje/indeks/bruker`, { aktorId });
}

export function indekserFnr(fnr: string): Promise<{ data: string }> {
	return fetchInstance.put(`/api/admin/veilarbportefolje/indeks/bruker/fnr`, { fnr });
}

export function hovedindeksering(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/indeks/AlleBrukere`);
}

export function hovedindekseringNyttAlias(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/indeks/AlleBrukereNyIndex`);
}

export function assignAliasToIndex(indexName: string): Promise<{ data: string }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/opensearch/assignAliasToIndex?indexName=${indexName}`);
}

export function deleteIndex(indexName: string): Promise<{ data: boolean }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/opensearch/deleteIndex?indexName=${indexName}`);
}

export function createIndex(): Promise<{ data: string }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/opensearch/createIndex`);
}

export function getAliases(): Promise<{ data: string }> {
	return fetchInstance.get(`/api/admin/veilarbportefolje/opensearch/getAliases`);
}

export function pdlLastInnData(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/pdl/lastInnDataFraPdl`);
}
export function hentEnsligForsorgerData(aktorId: string): Promise<{ data: JobId }> {
	console.log('Startet: hentEnsligForsorgerData');
	return fetchInstance.post(`/api/admin/veilarbportefolje/hentEnsligForsorgerData`, { aktorId });
}

export function hentEnsligForsorgerDataBatch(): Promise<{ data: JobId }> {
	console.log('Startet: hentEnsligForsorgerDataBatch');
	return fetchInstance.post(`/api/admin/veilarbportefolje/hentEnsligForsorgerDataBatch`);
}

export function hentMuligeDataTyperSomKanHentes(): Promise<{ data: AdminDataTypeResponse[] }> {
	return fetchInstance.get(`/api/admin/veilarbportefolje/hentData/hentDataForBruker/muligeValg`);
}

export function hentValgteDataForBruker(valgteDataTyper: AdminDataForBrukerRequest): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/admin/veilarbportefolje/hentData/hentDataForBruker/forValgte`, valgteDataTyper);
}
