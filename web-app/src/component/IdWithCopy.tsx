import React, { useState } from 'react';
import { Button, CopyButton } from '@navikt/ds-react';

interface IdWithCopyProps {
	id: string;
	label?: string;
}

export function IdWithCopy({ id, label }: IdWithCopyProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(id);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	return (
		<div className="flex items-center gap-2">
			{label && <span className="font-medium">{label}:</span>}
			<code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{id}</code>
			<CopyButton
				size="small"
				onClick={handleCopy}
				title="Kopier ID"
				copyText={id}
			/>
		</div>
	);
} 