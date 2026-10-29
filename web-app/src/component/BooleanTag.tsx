import { Tag } from '@navikt/ds-react';
import React from 'react';

interface BooleanTagProps {
	value: boolean;
	noIsGood?: boolean | undefined;
}

export function BooleanTag({ value, noIsGood }: BooleanTagProps) {
	const text = value ? 'Ja' : 'Nei';
	return (
		<Tag
			size="small"
			variant={
				value
					? noIsGood || false
						? 'error-moderate'
						: 'success-moderate'
					: noIsGood
						? 'success-moderate'
						: 'error-moderate'
			}
		>
			{text}
		</Tag>
	);
}
