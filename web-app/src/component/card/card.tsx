import React from 'react';
import cls from 'classnames';
import './card.less';
import { BodyShort } from '@navikt/ds-react';

interface CardProps {
	title?: string;
	children: any;
	className?: string;
	innholdClassName?: string;
}

export function Card(props: CardProps) {
	return (
		<div className={cls('card', props.className)}>
			{props.title && <BodyShort className="card__title">{props.title}</BodyShort>}
			<div className={props.innholdClassName}>{props.children}</div>
		</div>
	);
}
