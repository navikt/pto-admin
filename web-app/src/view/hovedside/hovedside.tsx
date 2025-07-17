import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import './hovedside.less';
import {
	aktorIdTilFnr,
	fnrTilAktorId,
	sjekkHarLesetilgang,
	sjekkHarSkrivetilgang,
	sjekkHarTilgangTilEgenAnsatt,
	sjekkHarTilgangTilEnhet,
	sjekkHarTilgangTilKode6,
	sjekkHarTilgangTilKode7
} from '../../api';
import { BodyShort, Button, Select, TextField } from '@navikt/ds-react';

export function Hovedside() {
	return (
		<div className="view hovedside">
			<FnrTilAktorIdCard />
			<AktorIdTilFnrCard />
			<HarTilgangTilEnhetCard />
			<HarSkrivetilgangCard />
			<HarLesetilgangCard />
			<HarTilgangTilKodeOgSkjermetCard />
		</div>
	);
}

function FnrTilAktorIdCard() {
	const [fnr, setFnr] = useState('');
	const [aktorId, setAktorId] = useState('');

	function handleOnFinnAktorId() {
		setAktorId('');
		fnrTilAktorId(fnr)
			.then(res => setAktorId(res.data.aktorId))
			.catch(e => alert('Klarte ikke å hente aktørid:\n' + e.toString()));
	}

	return (
		<Card title="Fødselsnummer → AktørId" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<TextField label="AktørId" disabled={true} value={aktorId} />
			<Button onClick={handleOnFinnAktorId}>Finn Aktørid</Button>
		</Card>
	);
}

function AktorIdTilFnrCard() {
	const [aktorId, setAktorId] = useState('');
	const [fnr, setFnr] = useState('');

	function handleOnFinnFnr() {
		setFnr('');
		aktorIdTilFnr(aktorId)
			.then(res => setFnr(res.data.fnr))
			.catch(e => alert('Klarte ikke å hente fnr:\n' + e.toString()));
	}

	return (
		<Card title="AktørId → Fødselsnummer" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="AktørId" value={aktorId} onChange={e => setAktorId(e.target.value)} />
			<TextField label="Fødselsnummer" disabled={true} value={fnr} />
			<Button onClick={handleOnFinnFnr}>Finn fødselsnummer</Button>
		</Card>
	);
}

function HarTilgangTilEnhetCard() {
	const [navIdent, setNavIdent] = useState('');
	const [enhetId, setEnhetId] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkTilgangTilEnhet() {
		setHarTilgang(null);
		sjekkHarTilgangTilEnhet(navIdent, enhetId)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke tilgang på enhet:\n' + e.toString()));
	}

	return (
		<Card title="Tilgang til enhet" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="Nav Ident" value={navIdent} onChange={e => setNavIdent(e.target.value)} />
			<TextField label="Enhet Id" value={enhetId} onChange={e => setEnhetId(e.target.value)} />
			<BodyShort className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</BodyShort>
			<Button onClick={handleOnSjekkTilgangTilEnhet}>Sjekk tilgang</Button>
		</Card>
	);
}

function HarSkrivetilgangCard() {
	const [navIdent, setNavIdent] = useState('');
	const [fnr, setFnr] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkHarSkrivetilgang() {
		setHarTilgang(null);
		sjekkHarSkrivetilgang(navIdent, fnr)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke skrivetilgang:\n' + e.toString()));
	}

	return (
		<Card title="Skrivetilgang til bruker" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="Nav Ident" value={navIdent} onChange={e => setNavIdent(e.target.value)} />
			<TextField label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<BodyShort className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</BodyShort>
			<Button onClick={handleOnSjekkHarSkrivetilgang}>Sjekk tilgang</Button>
		</Card>
	);
}

function HarLesetilgangCard() {
	const [navIdent, setNavIdent] = useState('');
	const [fnr, setFnr] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkHarLesetilgang() {
		setHarTilgang(null);
		sjekkHarLesetilgang(navIdent, fnr)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke lesetilgang:\n' + e.toString()));
	}

	return (
		<Card title="Lesetilgang til bruker" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="Nav Ident" value={navIdent} onChange={e => setNavIdent(e.target.value)} />
			<TextField label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<BodyShort className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</BodyShort>
			<Button onClick={handleOnSjekkHarLesetilgang}>Sjekk tilgang</Button>
		</Card>
	);
}

enum Tilgang {
	KODE_6 = 'KODE_6',
	KODE_7 = 'KODE_7',
	SKJERMET = 'SKJERMET'
}

function HarTilgangTilKodeOgSkjermetCard() {
	const [navIdent, setNavIdent] = useState('');
	const [tilgang, setTilgang] = useState<Tilgang>(Tilgang.KODE_6);
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkHarTilgang() {
		if (tilgang == null) {
			alert('Type tilgang må settes');
			return;
		}

		let tilgangPromise;

		switch (tilgang) {
			case Tilgang.KODE_6:
				tilgangPromise = sjekkHarTilgangTilKode6(navIdent);
				break;
			case Tilgang.KODE_7:
				tilgangPromise = sjekkHarTilgangTilKode7(navIdent);
				break;
			case Tilgang.SKJERMET:
				tilgangPromise = sjekkHarTilgangTilEgenAnsatt(navIdent);
				break;
			default:
				alert('Tilgang ikke satt');
				return;
		}

		setHarTilgang(null);

		tilgangPromise
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke tilgang:\n' + e.toString()));
	}

	return (
		<Card title="Kode 6/7 og skjermet" className="small-card" innholdClassName="hovedside__card-innhold">
			<TextField label="Nav Ident" value={navIdent} onChange={e => setNavIdent(e.target.value)} />
			<Select label="Tilgang" onChange={e => setTilgang(e.target.value as Tilgang)}>
				<option value={Tilgang.KODE_6}>Kode 6</option>
				<option value={Tilgang.KODE_7}>Kode 7</option>
				<option value={Tilgang.SKJERMET}>Skjermet</option>
			</Select>
			<BodyShort className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</BodyShort>
			<Button onClick={handleOnSjekkHarTilgang}>Sjekk tilgang</Button>
		</Card>
	);
}
