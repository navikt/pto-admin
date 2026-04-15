import { fetchInstance, JobId } from './index';

interface ArenaKontorDto {
	kontorId: string;
	kontorNavn: string;
}
interface GeografiskTilknyttetKontorDto {
	kontorId: string;
	kontorNavn: string;
}
interface ArbeidsoppfolgingKontorDto {
	kontorId: string;
	kontorNavn: string;
}
export interface KontorTilhorigheter {
	arena?: ArenaKontorDto;
	geografiskTilknytning?: GeografiskTilknyttetKontorDto;
	arbeidsoppfolging?: ArbeidsoppfolgingKontorDto;
}
export interface KontorHistorikkQueryDto {
	ident: string;
	kontorId: string;
	kontorType: string;
	endringsType: string;
	endretAv: string;
	endretAvType: string;
	endretTidspunkt: string;
}

const graphqlQuery = `
	query alleKontor($ident: String!) {
		kontorTilhorigheter(ident: $ident) {
			arena {
				kontorId
				kontorNavn
			},
			geografiskTilknytning {
				kontorId
				kontorNavn
			},
			arbeidsoppfolging {
				kontorId
				kontorNavn
			}
		}
		kontorHistorikk(ident: $ident) {
		 	ident,
		 	kontorId,
			kontorType,
			endringsType,
			endretAv,
			endretAvType,
			endretTidspunkt,
		}		
	}
`;

const graphqlBody = (ident: string) => ({
	query: graphqlQuery,
	variables: { ident }
});

export function hentKontorerMedHistorikk(payload: {
	ident: string;
}): Promise<{ data: { kontorTilhorigheter: KontorTilhorigheter; kontorHistorikk: KontorHistorikkQueryDto[] } }> {
	return fetchInstance
		.post<{
			data: { kontorTilhorigheter: KontorTilhorigheter; kontorHistorikk: KontorHistorikkQueryDto[] };
		}>(`/api/ao-oppfolgingskontor/graphql`, graphqlBody(payload.ident))
		.then(response => response.data);
}

// Republisering ao-oppfolgingskontor
export function republiserArbeidsoppfolgingskontorendret(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/ao-oppfolgingskontor/admin/republiser-arbeidsoppfolgingskontorendret`);
}

export function syncArenaKontorForBruker(payload: { identer: string }): Promise<void> {
	return fetchInstance
		.post(`/api/ao-oppfolgingskontor/admin/sync-arena-kontor`, {
			identer: payload.identer
		})
		.then(() => {});
}

export function republiserForUtvalgteOppfolgingsperioder(payload: { oppfolgingsperiodeIder: string }): Promise<void> {
	return fetchInstance
		.post(`/api/ao-oppfolgingskontor/admin/republiser-arbeidsoppfolgingskontorendret-utvalgte-perioder`, {
			oppfolgingsperioder: payload.oppfolgingsperiodeIder
		})
		.then(() => {});
}

export function doDryRunFinnKontor(payload: { identer: string }): Promise<{ data: Record<string, string> }> {
	return fetchInstance.post(`/api/ao-oppfolgingskontor/admin/finn-kontor`, {
		identer: payload.identer
	});
}

export function kontortelling(payload: { fraKontorer: string[]; tilKontor: string }): Promise<{ data: number }> {
	return fetchInstance.post(`/api/ao-oppfolgingskontor/admin/kontortelling`, {
		fraKontorer: payload.fraKontorer,
		tilKontor: payload.tilKontor
	});
}

export function mergeKontorer(payload: { fraKontorer: string[]; tilKontor: string }): Promise<void> {
	return fetchInstance
		.post(`/api/ao-oppfolgingskontor/admin/merge-kontorer`, {
			fraKontorer: payload.fraKontorer,
			tilKontor: payload.tilKontor
		})
		.then(() => {});
}

export function republiserTombstone(payload: { identer: string }): Promise<void> {
	return fetchInstance
		.post(`/api/ao-oppfolgingskontor/admin/republiser-arbeidsoppfolgingskontorendret-tombstone`, {
			identer: payload.identer
		})
		.then(() => {});
}

export interface FailedMessage {
	id: number;
	topic: string;
	messageKeyText: string;
	humanReadableValue: string;
	failureReason: string;
	retryCount: number;
	queueTimestamp: string;
	lastAttemptTimestamp: string | null;
}

export function fetchFailedMessages(): Promise<{ data: FailedMessage[] }> {
	return fetchInstance.get(`/api/ao-oppfolgingskontor/admin/failed-messages`);
}

export function deleteFailedMessage(id: number): Promise<void> {
	return fetchInstance.delete(`/api/ao-oppfolgingskontor/admin/failed-messages/${id}`);
}

export function hentInternIdent(payload: { ident: string }): Promise<{ data: { internIdent: number } }> {
	return fetchInstance.post(`/api/ao-oppfolgingskontor/admin/hent-intern-ident`, {
		ident: payload.ident
	});
}

export function hentIdenterForInternIdent(payload: { internIdent: number }): Promise<{ data: { aktorId: string | null; fnr: string | null } }> {
	return fetchInstance.post(`/api/ao-oppfolgingskontor/admin/identer-for-intern-ident`, {
		internIdent: payload.internIdent
	});
}
