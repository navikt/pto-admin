import React,{ useState } from "react"
import { Dialog, hentDialoger } from "../../api/veilarbdialog"
import { hentOppfolgingsperioder } from "../../api/veilarboppfolging"
import { Aktivitet, hentAktiviteter } from "../../api/veilarbaktivitet"
import { Button, TextField, Heading, Loader, Accordion, ExpansionCard, Timeline, Label, Table } from '@navikt/ds-react';
import { Card } from "../../component/card/card"
import { BooleanTag } from "../../component/BooleanTag"
import { IdWithCopy } from "../../component/IdWithCopy"
import dayjs from 'dayjs';

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

			{ isLoading && <Loader size="small" /> }
			{ error && <div className="error-message">{error}</div> }
			{ oppfolgingsperioder && oppfolgingsperioder.length > 0 &&
				<Timeline>
					<Timeline.Row label={'Oppfølgingsperioder'}>
						{
							oppfolgingsperioder?.map((oppfolgingsperiode) => (
								<Timeline.Period
									status={!oppfolgingsperiode.sluttTidspunkt ? 'success' : 'neutral'}
									start={dayjs(oppfolgingsperiode.startTidspunkt).toDate()}
									end={dayjs(oppfolgingsperiode.sluttTidspunkt ?? undefined).toDate()}
									key={oppfolgingsperiode.id}
								>
									{ dayjs(oppfolgingsperiode.startTidspunkt).format('DD.MM.YYYY') } -
									{ oppfolgingsperiode.sluttTidspunkt ? dayjs(oppfolgingsperiode.sluttTidspunkt).format('DD.MM.YYYY') : '->' }
								</Timeline.Period>
							))
						}
					</Timeline.Row>
				</Timeline>
			}
			{ oppfolgingsperioder && oppfolgingsperioder.map((periode: PeriodeMedDialoger) => (
				<div key={periode.id} className="mt-4">
					<Label size="medium">
						Periode
						<IdWithCopy id={periode.id} label="" />
					</Label>
					<div className="ml-4">
						<div><span className="font-bold">Start:</span> {new Date(periode.startTidspunkt).toLocaleDateString()}</div>
						<div><span className="font-bold">Slutt:</span> {periode.sluttTidspunkt ? new Date(periode.sluttTidspunkt).toLocaleDateString() : 'Aktiv'}</div>
						
						<div className="mt-4  font-bold">Dialoger ({periode.dialoger.length})</div>
						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Id</Table.HeaderCell>
									<Table.HeaderCell>Opprettet</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{periode.dialoger.map(dialog => (

									<Table.ExpandableRow aria-label={`Dialog ${dialog.id}`} key={dialog.id} content={
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
								}>
									<Table.DataCell>
										<IdWithCopy id={dialog.id} label="DialogId" />
									</Table.DataCell>
                                    <Table.DataCell>
										{new Date(dialog.opprettetDato).toLocaleString()}
                                    </Table.DataCell>
                                </Table.ExpandableRow>
								))}
							</Table.Body>
						</Table>
						<div className="mt-2 space-y-2">
							<div className="font-bold">Aktiviteter ({periode.aktiviteter.length})</div>
						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell />
									<Table.HeaderCell>Id</Table.HeaderCell>
									<Table.HeaderCell>Versjon</Table.HeaderCell>
									<Table.HeaderCell>Sist endret</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{ periode.aktiviteter.map(aktivitet =>
									(<Table.ExpandableRow key={aktivitet.id} content={
										<div className="ml-4">
											<IdWithCopy id={aktivitet.funksjonellId} label="FunksjonellId" />
											<div>Endret dato: {aktivitet.endretDato}</div>
											<div>Opprettet dato: {aktivitet.opprettetDato}</div>
											<div>Status: {aktivitet.status}</div>
											<div>Historisk: <BooleanTag value={aktivitet.historisk} /></div>
											<div>Type: {aktivitet.type}</div>
										</div>
									}>
										<Table.DataCell><IdWithCopy id={aktivitet.id} label="AktivitetId" />
										</Table.DataCell>
										<Table.DataCell>{ aktivitet.versjon }</Table.DataCell>
										<Table.DataCell>{ aktivitet.endretDato }</Table.DataCell>
									</Table.ExpandableRow>))
								}
							</Table.Body>
						</Table>
						</div>
					</div>
				</div>
			))}
		</Card>
	);
}