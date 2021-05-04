import React, { useState } from 'react';
import { errorToast, warningToast } from '../../utils/toast-utils';
import { Card } from '../../component/card/card';
import { Flatknapp } from 'nav-frontend-knapper';
import {
	getConsumerOffsets,
	GetConsumerOffsetsRequest,
	getLastRecordOffset,
	GetLastRecordOffsetRequest,
	KafkaRecord,
	readFromTopic,
	ReadFromTopicRequest,
	TopicPartitionOffset
} from '../../api/kafka-admin';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import constate from 'constate';
import './kafka-admin.less';

const [CredentialsStoreProvider, useCredentialsStore] = constate(() => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	return { username, setUsername, password, setPassword };
});

export function KafkaAdmin() {
	return (
		<div className="view kafka-admin">
			<CredentialsStoreProvider>
				<div className="card-row card-row--3-mini center-horizontal blokk-m">
					<CredentialsCard />
					<ConsumerOffsetsCard />
					<LastRecordOffsetCard />
				</div>
				<ReadFromTopicCard />
			</CredentialsStoreProvider>
		</div>
	);
}

function CredentialsCard() {
	const { username, setUsername, password, setPassword } = useCredentialsStore();

	return (
		<Card title="Credentials" className="mini-card" innholdClassName="card__content">
			<Normaltekst className="blokk-s">
				Alle funksjoner på denne siden krever at credentials fra en systembruker er utfylt
			</Normaltekst>

			<Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
			<Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
		</Card>
	);
}

function ConsumerOffsetsCard() {
	const { username, password } = useCredentialsStore();
	const [groupId, setGroupId] = useState('');
	const [topicName, setTopicName] = useState('');

	const [topicPartitionOffsets, setTopicPartitionOffsets] = useState<TopicPartitionOffset[]>([]);

	function handleHentConsumerOffsets() {
		const request: GetConsumerOffsetsRequest = {
			username,
			password,
			groupId,
			topicName
		};

		getConsumerOffsets(request)
			.then(res => {
				if (res.data.length === 0) {
					warningToast('Fant ingen offsets tilhørende konsumeren for topicen');
				} else {
					setTopicPartitionOffsets(res.data);
				}
			})
			.catch(() => errorToast('Klarte ikke å hente consumer offsets'));
	}

	return (
		<Card title="Consumer offsets" className="mini-card" innholdClassName="card__content">
			<Normaltekst className="blokk-s">
				Henter siste commitet offset for alle partisjoner tilhørende en consumer gruppe for en gitt topic
			</Normaltekst>

			<Input label="Consumer group id" value={groupId} onChange={e => setGroupId(e.target.value)} />
			<Input label="Topic name" value={topicName} onChange={e => setTopicName(e.target.value)} />

			<Flatknapp onClick={handleHentConsumerOffsets}>Fetch</Flatknapp>

			<ul>
				{topicPartitionOffsets.map((tpo, idx) => {
					return (
						<li key={idx}>
							Partition={tpo.topicPartition} Offset={tpo.offset}
						</li>
					);
				})}
			</ul>
		</Card>
	);
}

function LastRecordOffsetCard() {
	const { username, password } = useCredentialsStore();
	const [topicName, setTopicName] = useState('');
	const [topicPartition, setTopicPartition] = useState('');

	const [lastRecordOffset, setLastRecordOffset] = useState<number | null>(null);

	function handleHentLastRecordOffset() {
		const request: GetLastRecordOffsetRequest = {
			username,
			password,
			topicName,
			topicPartition: parseInt(topicPartition, 10)
		};

		getLastRecordOffset(request)
			.then(res => {
				setLastRecordOffset(res.data.latestRecordOffset);
			})
			.catch(() => errorToast('Klarte ikke å hente siste record offset'));
	}

	return (
		<Card title="Last record offset" className="mini-card" innholdClassName="card__content">
			<Normaltekst className="blokk-s">
				Henter offset til siste record(melding på kafka) som ligger på en topic+partisjon
			</Normaltekst>

			<Input label="Topic name" value={topicName} onChange={e => setTopicName(e.target.value)} />
			<Input
				label="Topic partition"
				type="number"
				value={topicPartition}
				onChange={e => setTopicPartition(e.target.value)}
			/>

			<Flatknapp onClick={handleHentLastRecordOffset}>Fetch</Flatknapp>

			{lastRecordOffset != null ? <Normaltekst>Offset til siste record: {lastRecordOffset}</Normaltekst> : null}
		</Card>
	);
}

function ReadFromTopicCard() {
	const { username, password } = useCredentialsStore();
	const [topicName, setTopicName] = useState('');
	const [topicPartition, setTopicPartition] = useState('');

	const [fromOffset, setFromOffset] = useState('');
	const [maxRecords, setMaxRecords] = useState('');

	const [recordsFromTopic, setRecordsFromTopic] = useState<KafkaRecord[]>([]);

	function handleReadFromTopic() {
		const request: ReadFromTopicRequest = {
			username,
			password,
			topicName,
			topicPartition: parseInt(topicPartition, 10),
			fromOffset: parseInt(fromOffset, 10),
			maxRecords: parseInt(maxRecords, 10)
		};

		readFromTopic(request)
			.then(res => {
				if (res.data.length === 0) {
					warningToast('Could not find any records in the topic+partition for the given offset');
				} else {
					setRecordsFromTopic(res.data);
				}
			})
			.catch(() => errorToast('Klarte ikke å hente siste record offset'));
	}

	return (
		<Card
			title="Read records from topic"
			className="very-large-card center-horizontal"
			innholdClassName="card__content"
		>
			<Normaltekst className="blokk-s">Leser meldinger fra en topic+partisjon</Normaltekst>

			<Input label="Topic name" value={topicName} onChange={e => setTopicName(e.target.value)} />
			<Input
				label="Topic partition"
				type="number"
				value={topicPartition}
				onChange={e => setTopicPartition(e.target.value)}
			/>

			<Input label="From offset" type="number" value={fromOffset} onChange={e => setFromOffset(e.target.value)} />
			<Input label="Max records" type="number" value={maxRecords} onChange={e => setMaxRecords(e.target.value)} />

			<Flatknapp onClick={handleReadFromTopic}>Fetch</Flatknapp>

			{recordsFromTopic.length > 0 ? (
				<table className="tabell tabell--stripet">
					<thead>
						<tr>
							<th>Offset</th>
							<th>Key</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						{recordsFromTopic.map(record => {
							return (
								<tr key={record.offset}>
									<td>{record.offset}</td>
									<td>{record.key}</td>
									<td className="kafka-record-value">{record.value}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : null}
		</Card>
	);
}
