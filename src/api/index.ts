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

export function fnrTilAktorId(fnr: string): AxiosPromise<AktorIdResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/ident/aktorId?fnr=${fnr}`);
}

export function aktorIdTilFnr(aktorId: string): AxiosPromise<FnrResponse> {
	return axiosInstance.get(`${PTO_ADMIN_API_URL}/api/ident/fnr?aktorId=${aktorId}`);
}
