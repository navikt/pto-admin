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
})

export const hentDialoger = ({ fnr }: { fnr: string }): Promise<{ data: { dialoger: Dialog[] } }> => {
	return axiosInstance.post(`/api/veilarbdialog/veilarbdialog/graphql`, hentDialogerGraphqlBody(fnr))
		.then(response => response.data);
}