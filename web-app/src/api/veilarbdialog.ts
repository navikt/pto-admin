import { fetchInstance, JobId } from './index';
import { GraphqlResponse, GraphqlResult, validateGraphqlResponse } from './graphql';

export interface Dialog {
	id: string;
	sisteDato: string;
	opprettetDato: string;
	historisk: boolean;
	lest: boolean;
	venterPaSvar: boolean;
	ferdigBehandlet: boolean;
	lestAvBrukerTidspunkt?: string;
	erLestAvBruker: boolean;
	oppfolgingsperiode: string;
}

const hentDialogerQuery = `
query hentDialoger($fnr: String!) {
  dialoger(fnr: $fnr) {
	id
    sisteDato
    opprettetDato
    historisk
    lest
    venterPaSvar
    ferdigBehandlet
    lestAvBrukerTidspunkt
    erLestAvBruker
    oppfolgingsperiode
  }
}
`;

const hentDialogerGraphqlBody = (fnr: string) => ({
	query: hentDialogerQuery,
	variables: { fnr }
});

export const hentDialoger = ({ fnr }: { fnr: string }): Promise<GraphqlResult<{ dialoger: Dialog[] | null }>> => {
	return fetchInstance
		.post<GraphqlResponse<{ dialoger: Dialog[] | null }>>(
			`/api/veilarbdialog/veilarbdialog/graphql`,
			hentDialogerGraphqlBody(fnr)
		)
		.then(response => validateGraphqlResponse(response.data, 'veilarbdialog'));
};

// Republisering veilarbdialog

export function republiserEndringPaaDialog(): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/veilarbdialog/api/admin/veilarbdialog/republiser/endring-paa-dialog`);
}

export function republiserEndringPaaDialogForBruker(aktorId: string): Promise<{ data: JobId }> {
	return fetchInstance.post(`/api/veilarbdialog//api/admin/veilarbdialog/republiser/endring-paa-dialog/bruker`, {
		aktorId: aktorId.trim()
	});
}
