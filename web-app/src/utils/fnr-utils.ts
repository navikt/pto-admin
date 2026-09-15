import { idnr } from '@navikt/fnrvalidator';

/**
 * Validerer at en streng er et gyldig norsk identifikasjonsnummer
 * (fødselsnummer, D-nummer, H-nummer eller T-nummer), inkludert kontrollsifre.
 * En ren lengdesjekk (11 tegn) er ikke tilstrekkelig for å avdekke feiltastede numre.
 */
export function erGyldigFnr(fnr: string): boolean {
	return idnr(fnr).status === 'valid';
}
