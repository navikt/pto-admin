import { describe, expect, it } from 'vitest';
import { erGyldigFnr } from './fnr-utils';

describe('erGyldigFnr', () => {
	it('should return true for a valid fødselsnummer', () => {
		expect(erGyldigFnr('13097248022')).toBe(true);
	});

	it('should return true for a valid D-nummer', () => {
		expect(erGyldigFnr('53097248016')).toBe(true);
	});

	it('should return false when the checksum is wrong', () => {
		expect(erGyldigFnr('13097248023')).toBe(false);
	});

	it('should return false when the number is too short', () => {
		expect(erGyldigFnr('1234567891')).toBe(false);
	});

	it('should return false when the number is too long', () => {
		expect(erGyldigFnr('123456789100')).toBe(false);
	});

	it('should return false for an empty string', () => {
		expect(erGyldigFnr('')).toBe(false);
	});

	it('should return false for non-numeric input', () => {
		expect(erGyldigFnr('abcdefghijk')).toBe(false);
	});
});
