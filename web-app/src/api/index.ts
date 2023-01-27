import axios, { AxiosPromise } from 'axios';

export const axiosInstance = axios.create({
	withCredentials: true,
	headers: { 'Nav-Consumer-Id': 'pto-admin' }
});

interface AktorIdResponse {
	aktorId: string;
}

interface FnrResponse {
	fnr: string;
}

interface TilgangResponse {
	harTilgang: boolean;
}

export interface UtrulletEnhet {
	enhetId: string;
	navn: string;
	createdAt: string;
}

export interface User {
	navAnsattAzureId: string;
	navn: string;
}

export function me(): AxiosPromise<User> {
	return axiosInstance.get(`/api/auth/me`);
}

export type JobId = string;

// Hovedside

export function fnrTilAktorId(fnr: string): AxiosPromise<AktorIdResponse> {
	return axiosInstance.get(`/api/ident/aktorId?fnr=${fnr}`);
}

export function aktorIdTilFnr(aktorId: string): AxiosPromise<FnrResponse> {
	return axiosInstance.get(`/api/ident/fnr?aktorId=${aktorId}`);
}

export function sjekkHarTilgangTilEnhet(navAnsattAzureId: string, enhetId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/enhet?navAnsattAzureId=${navAnsattAzureId}&enhetId=${enhetId}`);
}

export function sjekkHarSkrivetilgang(navAnsattAzureId: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/skriv?navAnsattAzureId=${navAnsattAzureId}&norskIdent=${norskIdent}`);
}

export function sjekkHarLesetilgang(navAnsattAzureId: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/les?navAnsattAzureId=${navAnsattAzureId}&norskIdent=${norskIdent}`);
}

export function sjekkHarTilgangTilKode6(navAnsattAzureId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/kode6?navAnsattAzureId=${navAnsattAzureId}`);
}

export function sjekkHarTilgangTilKode7(navAnsattAzureId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/kode7?navAnsattAzureId=${navAnsattAzureId}`);
}

export function sjekkHarTilgangTilEgenAnsatt(navAnsattAzureId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/skjermet?navAnsattAzureId=${navAnsattAzureId}`);
}

// Utrulling vedtaksstøtte

export function rullerUtEnhet(enhetId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.post(`/api/admin/veilarbvedtaksstotte/utrulling/${enhetId}`);
}

export function fjernUtrulling(enhetId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.delete(`/api/admin/veilarbvedtaksstotte/utrulling/${enhetId}`);
}

export function hentAlleUtrullinger(): AxiosPromise<UtrulletEnhet[]> {
	return axiosInstance.get(`/api/admin/veilarbvedtaksstotte/utrulling`);
}

// Republisering vedtaksstøtte

export function republiserSiste14aVedtak(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbvedtaksstotte/republiser/siste-14a-vedtak`);
}

export function republiserVedtak14aFattetDvh(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbvedtaksstotte/republiser/vedtak-14a-fattet-dvh`);
}

// Republisering veilarbdialog

export function republiserEndringPaaDialog(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbdialog/republiser/endring-paa-dialog`);
}

export function republiserEndringPaaOppfolgingsbrukere(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbarena/republiser/endring-pa-bruker/all`);
}

// Veilarbportefolje admin-funksjoner
export function indekserAktoer(aktorId: string): AxiosPromise<string> {
	return axiosInstance.put(`/api/admin/veilarbportefolje/indeks/bruker?aktorId=${aktorId}`);
}

export function indekserFnr(fnr: string): AxiosPromise<string> {
	return axiosInstance.put(`/api/admin/veilarbportefolje/indeks/bruker/fnr?fnr=${fnr}`);
}

export function hovedindeksering(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbportefolje/indeks/AlleBrukere`);
}

export function hovedindekseringNyttAlias(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/admin/veilarbportefolje/indeks/AlleBrukereNyIndex`);
}

export function assignAliasToIndex(indexName: string): AxiosPromise<string> {
	return axiosInstance.post(`/api/admin/veilarbportefolje/opensearch/assignAliasToIndex?indexName=${indexName}`);
}

export function deleteIndex(indexName: string): AxiosPromise<boolean> {
	return axiosInstance.post(`/api/admin/veilarbportefolje/opensearch/deleteIndex?indexName=${indexName}`);
}

export function createIndex(): AxiosPromise<string> {
	return axiosInstance.post(`/api/admin/veilarbportefolje/opensearch/createIndex`);
}

export function getAliases(): AxiosPromise<string> {
	return axiosInstance.get(`/api/admin/veilarbportefolje/opensearch/getAliases`);
}

