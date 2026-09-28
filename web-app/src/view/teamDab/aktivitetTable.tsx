import React from 'react';
import { Table } from '@navikt/ds-react';

export interface AktivitetKolonne {
	label: string;
	felt: string;
}

export function getValueByPath(value: unknown, path: string) {
	return path.split('.').reduce<unknown>((acc, key) => {
		if (!acc || typeof acc !== 'object') {
			return undefined;
		}

		return (acc as Record<string, unknown>)[key];
	}, value);
}

export function renderAktivitetTabellKolonner(aktivitet: unknown, kolonner: AktivitetKolonne[]) {
	return kolonner.map(kolonne => (
		<Table.DataCell key={kolonne.felt}>{String(getValueByPath(aktivitet, kolonne.felt) ?? '')}</Table.DataCell>
	));
}
