import React from 'react';
import './vedtaksstotte.less';
import { VedtaksstotteSlett } from './vedtaksstotte-slett';
import { VedtaksstotteSladd } from './vedtaksstotte-sladd';

export const Vedtaksstotte = () => {
	return (
		<div className={'view vedtaksstotte'}>
			<VedtaksstotteSlett />
			<VedtaksstotteSladd />
		</div>
	);
};
