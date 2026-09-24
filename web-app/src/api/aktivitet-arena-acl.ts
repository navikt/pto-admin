import { fetchInstance } from './index';

const springContextPath = '/aktivitet-arena-acl';
const apiPath = '/api/admin';
const poaoAdminRoutingPath = '/api/aktivitet-arena-acl';
const aktivitetArenaAclAdminUrl = `${poaoAdminRoutingPath}${springContextPath}${apiPath}`;

async function getJson<T>(path: string): Promise<{ data: T }> {
	return fetchInstance.get<T>(`${aktivitetArenaAclAdminUrl}${path}`);
}

export interface AdminDeltakerAktivitetMappingDto {
	deltakelseId: number;
	aktivitetId: string;
	aktivitetKategori: string;
	oppfolgingsPeriodeId: string;
	oppfolgingsPeriodeSluttTidspunkt: string | null;
}

export interface AdminArenaDataDto {
	id: number;
	arenaTableName: string;
	arenaId: string;
	operation: string;
	operationPosition: string;
	operationTimestamp: string;
	ingestStatus: string;
	ingestedTimestamp: string | null;
	ingestAttempts: number;
	lastAttempted: string | null;
	note: string | null;
}

export interface HentDeltakerAktivitetMappingRequest {
	deltakerId: number;
	funksjonellId?: string;
	oppfolgingsperiodeId?: string;
}

export function hentDeltakerAktivitetMapping(
	request: HentDeltakerAktivitetMappingRequest
): Promise<{ data: AdminDeltakerAktivitetMappingDto[] }> {
	const queryParams = new URLSearchParams();
	if (request.funksjonellId) {
		queryParams.set('funksjonellId', request.funksjonellId);
	}
	if (request.oppfolgingsperiodeId) {
		queryParams.set('oppfolgingsperiodeId', request.oppfolgingsperiodeId);
	}
	const suffix = queryParams.toString() ? `?${queryParams.toString()}` : '';
	return getJson<AdminDeltakerAktivitetMappingDto[]>(`/deltaker/mapping${suffix}`);
}

export function hentArenaData(arenaId: string): Promise<{ data: AdminArenaDataDto[] }> {
	return getJson<AdminArenaDataDto[]>(`/arena/${encodeURIComponent(arenaId)}/data`);
}
