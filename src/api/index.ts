import axios, { AxiosPromise } from 'axios';

const axiosInstance = axios.create({
	withCredentials: true,
	headers: { 'Nav-Consumer-Id': 'pto-admin-api' }
});

export const PTO_ADMIN_API_URL = '/pto-admin-api';

interface AktorIdResponse {
	aktorId: string;
}

interface FnrResponse {
	fnr: string;
}

interface TilgangResponse {
	harTilgang: boolean;
}

export interface User {
	ident: string;
	harTilgang: boolean;
}

export function me(): AxiosPromise<User> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/auth/me`);
}

export function fnrTilAktorId(fnr: string): AxiosPromise<AktorIdResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/ident/aktorId?fnr=${fnr}`);
}

export function aktorIdTilFnr(aktorId: string): AxiosPromise<FnrResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/ident/fnr?aktorId=${aktorId}`);
}

export function sjekkHarTilgangTilEnhet(navIdent: string, enhetId: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/enhet?navIdent=${navIdent}&enhetId=${enhetId}`);
}

export function sjekkHarSkrivetilgang(navIdent: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/skriv?navIdent=${navIdent}&norskIdent=${norskIdent}`);
}

export function sjekkHarLesetilgang(navIdent: string, norskIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/les?navIdent=${navIdent}&norskIdent=${norskIdent}`);
}

export function sjekkHarTilgangTilKode6(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/kode6?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilKode7(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/kode7?navIdent=${navIdent}`);
}

export function sjekkHarTilgangTilEgenAnsatt(navIdent: string): AxiosPromise<TilgangResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/tilgang/skjermet?navIdent=${navIdent}`);
}
