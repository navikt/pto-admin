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
	ident: string;
}

export function me(): AxiosPromise<User> {
	return axiosInstance.get(`/api/auth/me`);
}

// Hovedside

export function fnrTilAktorId(fnr: string): AxiosPromise<AktorIdResponse> {
	return axiosInstance.get(`/api/ident/aktorId?fnr=${fnr}`);
}

export function aktorIdTilFnr(aktorId: string): AxiosPromise<FnrResponse> {
	return axiosInstance.get(`/api/ident/fnr?aktorId=${aktorId}`);
}

export function sjekkHarTilgangTilEnhet(navIdent: string, enhetId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/enhet?navIdent=${navIdent}&enhetId=${enhetId}`);
}

export function sjekkHarSkrivetilgang(navIdent: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/skriv?navIdent=${navIdent}&norskIdent=${norskIdent}`);
}

export function sjekkHarLesetilgang(navIdent: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/les?navIdent=${navIdent}&norskIdent=${norskIdent}`);
}

export function sjekkHarTilgangTilKode6(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/kode6?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilKode7(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/kode7?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilEgenAnsatt(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`/api/tilgang/skjermet?navIdent=${navIdent}`);
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
