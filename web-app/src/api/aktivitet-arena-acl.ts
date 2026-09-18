import { fetchInstance } from './index';

const aktivitetArenaAclAdminUrl = '/api/admin';

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

export function hentDeltakerAktivitetMapping(
	deltakerId: number
): Promise<{ data: AdminDeltakerAktivitetMappingDto[] }> {
	return getJson<AdminDeltakerAktivitetMappingDto[]>(`/deltaker/${deltakerId}/mapping`);
}

export function hentArenaData(arenaId: string): Promise<{ data: AdminArenaDataDto[] }> {
	return getJson<AdminArenaDataDto[]>(`/arena/${encodeURIComponent(arenaId)}/data`);
}
