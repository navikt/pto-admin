import React, { Suspense, lazy } from 'react';
import { KafkaRecord } from '../../api/kafka-admin';
import './kafka-record-modal-content.less';
import { isJson, NO_OP } from '../../utils';
import { toTimestamp } from '../../utils/date-utils';
import { BodyShort, Label, Textarea, TextField } from '@navikt/ds-react';

const ReactJson = lazy(() => import('@microlink/react-json-view'));

export function KafkaRecordModalContent(props: { record: KafkaRecord | null }) {
	if (props.record == null) {
		return null;
	}

	const { key, value, offset, timestamp, headers } = props.record;
	const safeValue = value || '';
	const isRecordValueJson = isJson(safeValue);

	return (
		<div className="kafka-record-modal-content">
			<div className="blokk-m">
				<TextField label="Offset" value={offset} readOnly={true} />
				<TextField label="Key" value={key || 'NO_KEY'} readOnly={true} />
				<TextField label="Timestamp" value={toTimestamp(timestamp)} readOnly={true} />

				<Label htmlFor="label">Headers</Label>
				{headers.length > 0 ? (
					<ul>
						{headers.map((header, idx) => {
							return (
								<li key={idx}>
									Name={header.name} Value={header.value}
								</li>
							);
						})}
					</ul>
				) : (
					<BodyShort>
						<em>No headers</em>
					</BodyShort>
				)}
			</div>

			<Label htmlFor="label">Payload</Label>
			{isRecordValueJson ? (
				<Suspense fallback={<BodyShort>Laster JSON-visning...</BodyShort>}>
					<ReactJson name={false} src={JSON.parse(safeValue)} />
				</Suspense>
			) : (
				<Textarea value={safeValue} readOnly={true} onChange={NO_OP} />
			)}
		</div>
	);
}
