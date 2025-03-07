import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import './utrulling-vedtaksstotte.less';
import { fjernUtrulling, hentAlleUtrullinger, rullerUtEnhet, UtrulletEnhet } from '../../api';
import { errorToast, infoToast, successToast } from '../../utils/toast-utils';
import { formatDateTime } from '../../utils/date-utils';
import { BodyLong, BodyShort, Button, TextField } from '@navikt/ds-react';

export function UtrullingVedtaksstotte() {
	return (
		<div className="view utrulling-vedtaksstotte">
			<div className="utrulling-vedtaksstotte__card-row">
				<RullUtTilEnhetCard />
				<FjernUtrullingCard />
			</div>
			<AlleUtrulledeEnheterCard />
		</div>
	);
}

function RullUtTilEnhetCard() {
	const [enhetId, setEnhetId] = useState('');

	function handleRullUtTilEnhet() {
		if (enhetId.length !== 4) {
			errorToast('Enhet ID har ikke 4 tegn');
			return;
		}

		rullerUtEnhet(enhetId)
			.then(() => {
				successToast(`Tilgang til ${enhetId} har blitt rullet ut`);
				setEnhetId('');
			})
			.catch(() => errorToast('Klarte ikke å rulle ut tilgang til enhet ' + enhetId));
	}

	return (
		<Card title="Rull ut til enhet" className="small-card" innholdClassName="card__content">
			<BodyShort className="blokk-xxs">Enheter som blir lagt til her vil få tilgang til vedtaksstøtte</BodyShort>
			<TextField label="Enhet ID" value={enhetId} onChange={e => setEnhetId(e.target.value)} />
			<Button onClick={handleRullUtTilEnhet}>Rull ut</Button>
		</Card>
	);
}

function FjernUtrullingCard() {
	const [enhetId, setEnhetId] = useState('');

	function handleFjernUtrulling() {
		if (enhetId.length !== 4) {
			errorToast('Enhet ID har ikke 4 tegn');
			return;
		}

		fjernUtrulling(enhetId)
			.then(() => {
				successToast(`Tilgang til ${enhetId} har blitt fjernet`);
				setEnhetId('');
			})
			.catch(() => errorToast('Klarte ikke fjerne utrulling for ' + enhetId));
	}

	return (
		<Card title="Fjern utrulling fra enhet" className="small-card" innholdClassName="card__content">
			<BodyShort className="blokk-xxs">Enheter som blir fjernet vil miste tilgang til vedtaksstøtte</BodyShort>
			<TextField label="Enhet ID" value={enhetId} onChange={e => setEnhetId(e.target.value)} />
			<Button onClick={handleFjernUtrulling}>Fjern utrulling</Button>
		</Card>
	);
}

function AlleUtrulledeEnheterCard() {
	const [utrullinger, setUtrullinger] = useState<UtrulletEnhet[]>([]);

	function handleHentAlleUtrulledeEnheter() {
		hentAlleUtrullinger()
			.then(res => {
				if (res.data.length === 0) {
					infoToast('Ingen enheter har blitt utrullet enda');
				} else {
					const sorterteUtrullinger = res.data.sort((u1, u2) => (u1.createdAt < u2.createdAt ? -1 : 1));

					setUtrullinger(sorterteUtrullinger);
				}
			})
			.catch(() => errorToast('Klarte ikke å hente utrullinger'));
	}

	return (
		<Card title="Alle utrullede enheter" className="large-card" innholdClassName="card__content">
			<Button onClick={handleHentAlleUtrulledeEnheter}>Hent utrullede enheter</Button>
			<div className="utrulling-vedtaksstotte__utrullinger">
				{utrullinger.map((u, idx) => {
					return (
						<div key={idx} className="utrulling-vedtaksstotte__utrulling">
							<BodyShort>{u.navn}</BodyShort>
							<BodyLong>{u.enhetId}</BodyLong>
							<BodyLong>{formatDateTime(u.createdAt)}</BodyLong>
						</div>
					);
				})}
			</div>
		</Card>
	);
}
