import React,{ useState } from "react"
import { Dialog, hentDialoger } from "../../api/veilarbdialog"
import { hentOppfolgingsperioder } from "../../api/veilarboppfolging"
import { Aktivitet, hentAktiviteter } from "../../api/veilarbaktivitet"
import { Button, TextField, Heading, Loader, Accordion, ExpansionCard } from "@navikt/ds-react"
import { Card } from "../../component/card/card"
import { BooleanTag } from "../../component/BooleanTag"
import { IdWithCopy } from "../../component/IdWithCopy"

interface PeriodeMedDialoger {
	id: string;
	startTidspunkt: string;
	sluttTidspunkt: string;
	dialoger: Dialog[];
	aktiviteter: Aktivitet[];
}

export const BrukerDataCard = () => {
	const [oppfolgingsperioder, setOppfolgingsperioder] = useState<PeriodeMedDialoger[] | null>(null)
	const [error, setError] = useState<string | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	const fetchBrukerData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const fnr = formData.get('fnr') as string;
		if (!fnr) {
			setError('Fnr er påkrevd');
			return;
		}
		setIsLoading(true)
		Promise.all([
			hentDialoger({ fnr }),
			hentOppfolgingsperioder({ fnr }),
			hentAktiviteter({ fnr })
		]).then(([dialogerResponse, oppfolgingsperioderResponse, aktiviteterResponse]) => {
			const perioderMedAktiviteter = aktiviteterResponse?.data?.perioder || [];
			const dialoger = dialogerResponse?.data?.dialoger || [];
			const perioder = (oppfolgingsperioderResponse?.data?.oppfolgingsPerioder || [])
				.map(periode => {
					return {
						...periode,
						dialoger: dialoger.filter(dialog => dialog.oppfolgingsperiode === periode.id),
						aktiviteter: perioderMedAktiviteter.find(periodeMedAktiviteter => periodeMedAktiviteter.id === periode.id)?.aktiviteter || []
					}
				})
			setOppfolgingsperioder(perioder)
		})
			.catch(e => { })
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<Card className="large-card" innholdClassName=" flex flex-col space-y-4">
			<Heading size="medium">Brukerdata</Heading>
			<form className="space-y-4" onSubmit={fetchBrukerData}>
				<TextField name="fnr" label={'Fnr'} />
				<Button>Hent</Button>
			</form>
			
			<p>Her kan du vise brukerdata.</p>
			{ isLoading && <Loader size="small" /> }
			{ error && <div className="error-message">{error}</div> }
			{ oppfolgingsperioder && oppfolgingsperioder.map((periode: PeriodeMedDialoger) => (
				<div key={periode.id} className="mt-4">
					<IdWithCopy id={periode.id} label="Oppfølgingsperiode" />
					<div className="ml-4">
						<div>Start: {new Date(periode.startTidspunkt).toLocaleDateString()}</div>
						<div>Slutt: {periode.sluttTidspunkt ? new Date(periode.sluttTidspunkt).toLocaleDateString() : 'Aktiv'}</div>
						
						<div className="mt-2 font-bold">Dialoger ({periode.dialoger.length})</div>
						{periode.dialoger.map(dialog => (
							<div key={dialog.id} className="ml-4 mt-1 border p-1 border-gray-300 bg-gray-50 rounded-md">
								<IdWithCopy id={dialog.id} label="DialogId" />
                                <ExpansionCard aria-label={`Dialog ${dialog.id}`} size="small">
                                    <ExpansionCard.Header>
                                    Opprettet: {new Date(dialog.opprettetDato).toLocaleString()}
                                    </ExpansionCard.Header>
                                    <ExpansionCard.Content>
                                        <div className="ml-4">
                                            <div>Venter på svar fra: <BooleanTag value={dialog.venterPaSvar} /></div>
                                            <div>Ferdig behandlet: <BooleanTag value={dialog.ferdigBehandlet} /></div>
                                            <div>Lest: <BooleanTag value={dialog.lest} /></div>
                                            <div>Er lest av bruker: <BooleanTag value={dialog.erLestAvBruker} /></div>
                                            <div>Historisk: <BooleanTag value={dialog.historisk} /></div>
                                            <div>Opprettet dato: {dialog.opprettetDato}</div>
                                            <div>Siste dato: {dialog.sisteDato}</div>
                                            {dialog.lestAvBrukerTidspunkt && (
                                                <div>Lest av bruker tidspunkt: {dialog.lestAvBrukerTidspunkt}</div>
                                            )}
                                        </div>
                                    </ExpansionCard.Content>
                                </ExpansionCard>
							</div>
						))}
						<div className="mt-2 space-y-2">
							<div className="font-bold">Aktiviteter ({periode.aktiviteter.length})</div>
						{
							periode.aktiviteter.map(aktivitet => (
								<div key={aktivitet.id} className="ml-4 border p-1 border-gray-300 bg-gray-50 rounded-md">
									<IdWithCopy id={aktivitet.id} label="AktivitetId" />
									<IdWithCopy id={aktivitet.funksjonellId} label="FunksjonellId" />
									<details>
										<summary>Versjon: {aktivitet.versjon}</summary>	
										<div className="ml-4">
											<div>Endret dato: {aktivitet.endretDato}</div>
											<div>Opprettet dato: {aktivitet.opprettetDato}</div>
											<div>Status: {aktivitet.status}</div>
											<div>Historisk: <BooleanTag value={aktivitet.historisk} /></div>
											<div>Type: {aktivitet.type}</div>
										</div>
									</details>
								</div>
							))
						}
						</div>
					</div>
				</div>
			))}
		</Card>
	);
}