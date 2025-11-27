import { axiosInstance, JobId } from './index';
import { AxiosPromise } from 'axios';

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
	return axiosInstance
		.post(`/api/ao-oppfolgingskontor/graphql`, graphqlBody(payload.ident))
		.then(response => response.data);
}

// Republisering ao-oppfolgingskontor
export function republiserArbeidsoppfolgingskontorendret(): AxiosPromise<JobId> {
	return axiosInstance.post(`/api/ao-oppfolgingskontor/admin/republiser-arbeidsoppfolgingskontorendret`);
}

export function syncArenaKontorForBruker(payload: { identer: string }): Promise<void> {
	return axiosInstance.post(`/api/ao-oppfolgingskontor/admin/sync-arena-kontor`, {
		identer: payload.identer
	});
}

export function patchIdentMappingOgRepubliser(payload: { identer: string }): Promise<void> {
	return axiosInstance.post(`/api/ao-oppfolgingskontor/admin/republiser-arbeidsoppfolgingskontorendret-utvalgte-brukere`, {
		identer: payload.identer
	});
}
