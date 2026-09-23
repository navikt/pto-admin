import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Button, Heading, Textarea, BodyShort, Table } from '@navikt/ds-react';
import { AvslutningsStatusDto, hentAvslutningStatusForOppfolgingsperioder } from '../../api/veilarboppfolging';
import { BooleanTag } from '../../component/BooleanTag';
import { IdWithCopy } from '../../component/IdWithCopy';

export function HentAvslutningsstatusCard() {
	const [oppfolgingsperiodeIder, setOppfolgingsperiodeIder] = useState('');
	const [data, setData] = useState<Record<string, AvslutningsStatusDto | undefined> | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentAvslutningStatusForOppfolgingsperioder({
				oppfolgingsperiodeIder: oppfolgingsperiodeIder
					.split(',')
					.map(id => id.trim())
					.filter(Boolean)
			});
			setData(response);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Hent avslutningsstatus</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<Textarea
					label="Oppfølgingsperiode IDer (kommaseparert)"
					value={oppfolgingsperiodeIder}
					onChange={e => setOppfolgingsperiodeIder(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent avslutningsstatus
				</Button>
			</form>
			{data && (
				<div className="mt-4 space-y-3">
					{Object.keys(data).length ? (
						Object.entries(data).map(([periodeId, item]) => (
							<div key={periodeId} className="border rounded p-3">
								<IdWithCopy id={periodeId} />
								{
									<Table size="small">
										<Table.Header>
											<Table.Row>
												<Table.HeaderCell scope="col">Sjekk</Table.HeaderCell>
												<Table.HeaderCell scope="col">Status</Table.HeaderCell>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Kan avslutte</Table.DataCell>
												<Table.DataCell>
													{item?.kanAvslutte ? (
														<BooleanTag value={item?.kanAvslutte} />
													) : (
														'null'
													)}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Under oppfølging</Table.DataCell>
												<Table.DataCell>
													{item?.underOppfolging ? (
														<BooleanTag value={item?.underOppfolging} />
													) : (
														'null'
													)}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Er arbeidssøker</Table.DataCell>
												<Table.DataCell>
													{item?.erArbeidssoeker ? (
														<BooleanTag value={item?.erArbeidssoeker} />
													) : (
														'null'
													)}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Har AAP</Table.DataCell>
												<Table.DataCell>
													{item?.harAap ? <BooleanTag value={item?.harAap} /> : 'null'}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Er ISERV</Table.DataCell>
												<Table.DataCell>
													{item?.erIserv ? <BooleanTag value={item?.erIserv} /> : 'null'}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">
													Er deltaker i ungdomsprogrammet
												</Table.DataCell>
												<Table.DataCell>
													{item?.erDeltakerIUngdomsprogrammet ? (
														<BooleanTag value={item?.erDeltakerIUngdomsprogrammet} />
													) : (
														'null'
													)}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Under KVP</Table.DataCell>
												<Table.DataCell>
													{item?.underKvp ? <BooleanTag value={item?.underKvp} /> : 'null'}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">
													Har aktive tiltaksdeltakelser
												</Table.DataCell>
												<Table.DataCell>
													{item?.harAktiveTiltaksdeltakelser ? (
														<BooleanTag value={item?.harAktiveTiltaksdeltakelser} />
													) : (
														'null'
													)}
												</Table.DataCell>
											</Table.Row>
											<Table.Row key={periodeId}>
												<Table.DataCell scope="row">Inaktiveringsdato</Table.DataCell>
												<Table.DataCell>{item?.inaktiveringsDato || 'null'}</Table.DataCell>
											</Table.Row>
										</Table.Body>
									</Table>
								}
							</div>
						))
					) : (
						<BodyShort>Ingen treff</BodyShort>
					)}
				</div>
			)}
		</Card>
	);
}
