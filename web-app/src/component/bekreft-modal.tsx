import React from 'react';

import Modal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

export interface BekreftModalProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    action: () => void;
    description: string;
}

export default function BekreftModal(props: BekreftModalProps) {
    return (<Modal
        className="bekreft-modal"
        isOpen={props.isOpen}
        onRequestClose={() => {
            props.setOpen(false);
        }}
        closeButton={true}
        contentLabel="Bekreft handling"
    >
        <div className="bekreft-modal__innhold">
            <Systemtittel>Sikker?</Systemtittel>
            <Normaltekst>
                {props.description}
            </Normaltekst>
            <Hovedknapp
                className="bekreft-modal__bekreft"
                onClick={() => {
                    props.setOpen(false);
                    props.action();
                }}>
                Bekreft
            </Hovedknapp>
        </div>
    </Modal>);
}