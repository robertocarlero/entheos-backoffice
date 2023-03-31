import { RegularExpressions } from '../enums/regular-expressions';

export const EventIsANumber = (event: KeyboardEvent) => {
	return eventIsAllowed(event, RegularExpressions.NUMBER);
};

export const EventIsAlphabetic = (event: KeyboardEvent) => {
	return eventIsAllowed(event, RegularExpressions.ALPHABETIC_SPANISH);
};

const eventIsAllowed = (event: KeyboardEvent, pattern: string | RegExp) => {
	const key = document.all ? event.keyCode : event.which;
	// Tecla de retroceso para borrar, siempre la permite
	if (key === 8) return true;

	// Tecla tab para avanzar entre campos, siempre la permite
	if (key === 9) return true;

	// Teclas de flechas para mover, siempre la permite
	if (key === 37 || key === 39) return true;

	const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
	return isAValidKey(event.key || key, regex);
};

const isAValidKey = (key: number | string, pattern: RegExp) => {
	const char = typeof key === 'number' ? String.fromCharCode(key) : key;
	const result = pattern.test(char);
	return result;
};

export const CheckEventIsAllowed = (
	event: KeyboardEvent,
	type: 'alphabetic' | 'numeric'
) => {
	switch (type) {
		case 'alphabetic':
			ResolveEventResult(EventIsAlphabetic(event));
			break;
		case 'numeric':
			ResolveEventResult(EventIsANumber(event));
			break;
		default:
			break;
	}
};

const ResolveEventResult = (key_is_valid: boolean) => {
	if (key_is_valid) return;
	event.preventDefault();
};
