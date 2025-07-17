import { Tag } from '@navikt/ds-react';
import React from 'react';

interface BooleanTagProps {
	value: boolean;
}

export function BooleanTag({ value }: BooleanTagProps) {
	const text = value ? 'Ja' : 'Nei';
	return (
		<Tag size="small" variant={value ? 'success-moderate' : 'error-moderate'}>
            {text}
        </Tag>
	);
} 