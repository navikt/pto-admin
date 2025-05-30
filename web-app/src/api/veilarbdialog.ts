import { axiosInstance } from './index';

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
query hentDialoger {
  dialoger {
	id: String
    sisteDato: Date
    opprettetDato: Date
    historisk: Boolean
    lest: Boolean
    venterPaSvar: Boolean
    ferdigBehandlet: Boolean
    lestAvBrukerTidspunkt: Date
    erLestAvBruker: Boolean
    oppfolgingsperiode: String
  }
}
`;

const hentDialogerGraphqlBody = (fnr: string) => ({
	query: hentDialogerQuery,
	variables: { fnr }
})

export const hentDialoger = ({ fnr }: { fnr: string }): Promise<{ data: { dialoger: Dialog[] } }> => {
	return axiosInstance.post(`/api/admin/veilarboppfolging/graphql`, hentDialogerGraphqlBody(fnr))
		.then(response => response.data);
}