import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import './hovedside.less';
import { Input } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
import { aktorIdTilFnr, fnrTilAktorId } from '../../api';

export function Hovedside() {
	return (
		<div className="view hovedside">
			<FnrTilAktorIdCard />
			<AktorIdTilFnrCard />
		</div>
	);
}

function FnrTilAktorIdCard() {
	const [fnr, setFnr] = useState('');
	const [aktorId, setAktorId] = useState('');

	function handleOnFinnAktorId() {
		fnrTilAktorId(fnr)
			.then(res => setAktorId(res.data.aktorId))
			.catch(e => alert('Klarte ikke å hente aktørid:\n' + e.toString()));
	}

	return (
		<Card
			title="Fødselsnummer → AktørId"
			className="hovedside__identoppslag-card"
			innholdClassName="hovedside__card-innhold"
		>
			<Input label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<Input label="AktørId" disabled={true} value={aktorId} />
			<Flatknapp onClick={handleOnFinnAktorId}>Finn Aktørid</Flatknapp>
		</Card>
	);
}

function AktorIdTilFnrCard() {
	const [aktorId, setAktorId] = useState('');
	const [fnr, setFnr] = useState('');

	function handleOnFinnFnr() {
		aktorIdTilFnr(aktorId)
			.then(res => setFnr(res.data.fnr))
			.catch(e => alert('Klarte ikke å hente fnr:\n' + e.toString()));
	}

	return (
		<Card
			title="AktørId → Fødselsnummer"
			className="hovedside__identoppslag-card"
			innholdClassName="hovedside__card-innhold"
		>
			<Input label="AktørId" value={aktorId} onChange={e => setAktorId(e.target.value)} />
			<Input label="Fødselsnummer" disabled={true} value={fnr} />
			<Flatknapp onClick={handleOnFinnFnr}>Finn fødselsnummer</Flatknapp>
		</Card>
	);
}
