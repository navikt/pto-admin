import React from 'react';

import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';

export interface BekreftModalProps {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	action: () => void;
	description: string;
}

export default function BekreftModal(props: BekreftModalProps) {
	return (
		<Modal
			className="bekreft-modal"
			open={props.isOpen}
			onClose={() => {
				props.setOpen(false);
			}}
			header={{
				heading: 'Bekreft handling',
				closeButton: true
			}}
		>
			<div className="bekreft-modal__innhold">
				<Heading size="large">Sikker?</Heading>
				<BodyShort>{props.description}</BodyShort>
				<Button
					className="bekreft-modal__bekreft"
					onClick={() => {
						props.setOpen(false);
						props.action();
					}}
				>
					Bekreft
				</Button>
			</div>
		</Modal>
	);
}
