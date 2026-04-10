import React, { useState } from 'react';
import { Alert, Button, Heading, Table } from '@navikt/ds-react';
import { FailedMessage, fetchFailedMessages } from '../../api/ao-oppfolgingskontor';

export const AoKontorFailedMessages = () => {
	const [messages, setMessages] = useState<FailedMessage[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFetch = () => {
		setIsLoading(true);
		setError(null);
		fetchFailedMessages()
			.then(response => setMessages(response.data))
			.catch(err => setError(err.message ?? 'Ukjent feil ved henting av meldinger'))
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="space-y-4">
			<Heading size="medium">Feilende meldinger i AO-kontor</Heading>
			<Button onClick={handleFetch} loading={isLoading} className="my-4 mt-6">
				Hent meldinger
			</Button>

			{error && (
				<Alert variant="error" className="my-2">
					{error}
				</Alert>
			)}

			{messages !== null &&
				!error &&
				(messages.length === 0 ? (
					<Alert variant="success" className="my-2">
						Ingen feilende meldinger
					</Alert>
				) : (
					<Table size="small" className="my-2">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell />
								<Table.HeaderCell>ID</Table.HeaderCell>
								<Table.HeaderCell>Topic</Table.HeaderCell>
								<Table.HeaderCell>Message Key</Table.HeaderCell>
								<Table.HeaderCell>Verdi</Table.HeaderCell>
								<Table.HeaderCell>Feilårsak</Table.HeaderCell>
								<Table.HeaderCell>Forsøk</Table.HeaderCell>
								<Table.HeaderCell>Køtidspunkt</Table.HeaderCell>
								<Table.HeaderCell>Siste forsøk</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{messages.map(msg => (
								<Table.ExpandableRow
									key={msg.id}
									content={
										<div>
											<div className="font-bold mb-1">Feilårsak (komplett):</div>
											<pre
												style={{
													whiteSpace: 'pre-wrap',
													wordBreak: 'break-word',
													fontSize: '0.85rem',
													background: '#f4f4f4',
													padding: '0.5rem',
													borderRadius: '4px',
													overflow: 'auto',
													maxHeight: '400px'
												}}
											>
												{msg.failureReason}
											</pre>
										</div>
									}
								>
									<Table.DataCell>{msg.id}</Table.DataCell>
									<Table.DataCell>{msg.topic}</Table.DataCell>
									<Table.DataCell>{msg.messageKeyText}</Table.DataCell>
									<Table.DataCell>{msg.humanReadableValue}</Table.DataCell>
									<Table.DataCell
										style={{
											maxWidth: '300px',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										{msg.failureReason}
									</Table.DataCell>
									<Table.DataCell>{msg.retryCount}</Table.DataCell>
									<Table.DataCell>{new Date(msg.queueTimestamp).toLocaleString()}</Table.DataCell>
									<Table.DataCell>
										{msg.lastAttemptTimestamp
											? new Date(msg.lastAttemptTimestamp).toLocaleString()
											: '–'}
									</Table.DataCell>
								</Table.ExpandableRow>
							))}
						</Table.Body>
					</Table>
				))}
		</div>
	);
};
