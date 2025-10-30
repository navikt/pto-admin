import React from 'react';
import cls from 'classnames';
import './card.less';
import { BodyShort, Heading } from '@navikt/ds-react';

interface CardProps {
	title?: string;
	children: any;
	className?: string;
	innholdClassName?: string;
}

export function Card(props: CardProps) {
	return (
		<div className={cls('card drop-shadow-md ', props.className)}>
			{props.title && (
				<div className="mb-2">
					<Heading size="small">{props.title}</Heading>
				</div>
			)}
			<div className={props.innholdClassName}>{props.children}</div>
		</div>
	);
}
