import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import './hovedside.less';
import { Input, Select } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
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
import { Normaltekst } from 'nav-frontend-typografi';

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
		setFnr('');
		aktorIdTilFnr(aktorId)
			.then(res => setFnr(res.data.fnr))
			.catch(e => alert('Klarte ikke å hente fnr:\n' + e.toString()));
	}

	return (
		<Card title="AktørId → Fødselsnummer" className="small-card" innholdClassName="hovedside__card-innhold">
			<Input label="AktørId" value={aktorId} onChange={e => setAktorId(e.target.value)} />
			<Input label="Fødselsnummer" disabled={true} value={fnr} />
			<Flatknapp onClick={handleOnFinnFnr}>Finn fødselsnummer</Flatknapp>
		</Card>
	);
}

function HarTilgangTilEnhetCard() {
	const [navAnsattAzureIdent, setNavAnsattAzureIdent] = useState('');
	const [enhetId, setEnhetId] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkTilgangTilEnhet() {
		setHarTilgang(null);
		sjekkHarTilgangTilEnhet(navAnsattAzureIdent, enhetId)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke tilgang på enhet:\n' + e.toString()));
	}

	return (
		<Card title="Tilgang til enhet" className="small-card" innholdClassName="hovedside__card-innhold">
			<Input label="NAV Ident" value={navAnsattAzureIdent} onChange={e => setNavAnsattAzureIdent(e.target.value)} />
			<Input label="Enhet Id" value={enhetId} onChange={e => setEnhetId(e.target.value)} />
			<Normaltekst className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</Normaltekst>
			<Flatknapp onClick={handleOnSjekkTilgangTilEnhet}>Sjekk tilgang</Flatknapp>
		</Card>
	);
}

function HarSkrivetilgangCard() {
	const [navAnsattAzureId, setNavAnsattAzureId] = useState('');
	const [fnr, setFnr] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkHarSkrivetilgang() {
		setHarTilgang(null);
		sjekkHarSkrivetilgang(navAnsattAzureId, fnr)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke skrivetilgang:\n' + e.toString()));
	}

	return (
		<Card title="Skrivetilgang til bruker" className="small-card" innholdClassName="hovedside__card-innhold">
			<Input label="NAV Ident" value={navAnsattAzureId} onChange={e => setNavAnsattAzureId(e.target.value)} />
			<Input label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<Normaltekst className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</Normaltekst>
			<Flatknapp onClick={handleOnSjekkHarSkrivetilgang}>Sjekk tilgang</Flatknapp>
		</Card>
	);
}

function HarLesetilgangCard() {
	const [navAnsattAzureId, setNavAnsattAzureId] = useState('');
	const [fnr, setFnr] = useState('');
	const [harTilgang, setHarTilgang] = useState<boolean | null>(null);

	function handleOnSjekkHarLesetilgang() {
		setHarTilgang(null);
		sjekkHarLesetilgang(navAnsattAzureId, fnr)
			.then(res => setHarTilgang(res.data.harTilgang))
			.catch(e => alert('Klarte ikke å sjekke lesetilgang:\n' + e.toString()));
	}

	return (
		<Card title="Lesetilgang til bruker" className="small-card" innholdClassName="hovedside__card-innhold">
			<Input label="NAV Ident" value={navAnsattAzureId} onChange={e => setNavAnsattAzureId(e.target.value)} />
			<Input label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} />
			<Normaltekst className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</Normaltekst>
			<Flatknapp onClick={handleOnSjekkHarLesetilgang}>Sjekk tilgang</Flatknapp>
		</Card>
	);
}

enum Tilgang {
	KODE_6 = 'KODE_6',
	KODE_7 = 'KODE_7',
	SKJERMET = 'SKJERMET'
}

function HarTilgangTilKodeOgSkjermetCard() {
	const [navAnsattAzureId, setnavAnsattAzureId] = useState('');
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
				tilgangPromise = sjekkHarTilgangTilKode6(navAnsattAzureId);
				break;
			case Tilgang.KODE_7:
				tilgangPromise = sjekkHarTilgangTilKode7(navAnsattAzureId);
				break;
			case Tilgang.SKJERMET:
				tilgangPromise = sjekkHarTilgangTilEgenAnsatt(navAnsattAzureId);
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
			<Input label="NAV Ident" value={navAnsattAzureId} onChange={e => setnavAnsattAzureId(e.target.value)} />
			<Select label="Tilgang" onChange={e => setTilgang(e.target.value as Tilgang)}>
				<option value={Tilgang.KODE_6}>Kode 6</option>
				<option value={Tilgang.KODE_7}>Kode 7</option>
				<option value={Tilgang.SKJERMET}>Skjermet</option>
			</Select>
			<Normaltekst className="hovedside__har-tilgang-label">
				Har tilgang:{' '}
				<strong className="hovedside__har-tilgang-svar">
					{harTilgang == null ? '' : harTilgang.toString()}
				</strong>
			</Normaltekst>
			<Flatknapp onClick={handleOnSjekkHarTilgang}>Sjekk tilgang</Flatknapp>
		</Card>
	);
}
