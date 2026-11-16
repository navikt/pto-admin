import { toast } from 'react-toastify';
import { HttpError } from '../api';

export function errorToast(message: string) {
	toast(message, { type: 'error', position: 'top-right' });
}

export function httpErrorToast(context: string, error: unknown) {
	const maxResponseLength = 500;
	if (error instanceof HttpError) {
		const responseText = error.responseText.trim();
		const details = responseText && responseText.length <= maxResponseLength ? `: ${responseText}` : '';
		errorToast(`${context} (HTTP ${error.status})${details}`);
	} else {
		const details = error instanceof Error ? `: ${error.message.slice(0, maxResponseLength)}` : '';
		errorToast(`${context} (ingen HTTP-status mottatt)${details}`);
	}
}

export function successToast(message: string) {
	toast(message, { type: 'success', position: 'top-right' });
}

export function infoToast(message: string) {
	toast(message, { type: 'info', position: 'top-right' });
}

export function warningToast(message: string) {
	toast(message, { type: 'warning', position: 'top-right' });
}
