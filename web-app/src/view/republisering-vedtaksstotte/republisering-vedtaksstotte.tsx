import React from 'react';
import { Card } from '../../component/card/card';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import { republiserInnsatsbehovVedtaksstotte } from '../../api';
import { errorToast } from '../../utils/toast-utils';
import './republisering-vedtaksstotte.less';
import { toast } from 'react-toastify';

export function RepubliseringVedtaksstotte() {

	function handleRepubliserInnsatsbehovVedtaksstotte() {
		republiserInnsatsbehovVedtaksstotte()
			.then((resp) => {
				toast(`Republisering av innsatsbehov er startet med jobId ${resp.data}`, {
					type: 'success',
					position: 'top-right',
					autoClose: false,
					closeOnClick: false
				});
			})
			.catch(() => errorToast('Klarte ikke å starte republisering av innsatsbehov'));
	}

	return (
		<div className="view republisering-vedtaksstotte">
			<Card title="Republiser innsatsbehov fra Modia vedtaksstøtte" className="large-card"
				  innholdClassName="card__content">
				<Normaltekst className="blokk-xxs">
					Republiserer innsatsbehov for brukere som har fått vedtak i Modia vedtaksstøtte. Republiserer ikke
					for brukere som bare har vedtak i Arena, men dersom en bruker har vedtak i Modia vedtaksstøtte og et
					nyere i Arena, så vil innsatsbehovet fra vedtak i Arena bli republisert.
				</Normaltekst>
				<Flatknapp onClick={handleRepubliserInnsatsbehovVedtaksstotte}>Republiser innsatsbehov</Flatknapp>
			</Card>
		</div>
	);
}
