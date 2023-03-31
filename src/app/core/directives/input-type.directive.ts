import { RegularExpressions } from './../enums/regular-expressions';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { InputTypes } from '../enums/input-types';
import { element } from 'protractor';

@Directive({
	selector: '[inputType]',
})
export class InputTypeDirective {
	private ALLOWEDS_KEYS = [
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArroDown',
		'Backspace',
		'Tab',
		'Alt',
		'Shift',
		'Control',
		'Enter',
		'Delete',
		'Meta',
	];

	constructor(private el: ElementRef) {}

	@Input() inputType: InputTypes = InputTypes.ALPHABETIC;

	@HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
		this.switchValidation(event);
	}

	public get element(): HTMLInputElement {
		return this.el.nativeElement;
	}

	public set value(new_value: string) {
		this.el.nativeElement.value = new_value;
	}

	public get value(): string {
		return this.el.nativeElement.value;
	}

	private switchValidation(event: KeyboardEvent) {
		switch (this.inputType) {
			case 'alphabetic':
				return this.validate(
					event,
					RegularExpressions.ALPHABETIC_SPANISH
				);
			case 'numeric':
				return this.validate(event, RegularExpressions.NUMBER);
			case 'dni':
				this.validateDNI(event);
			default:
				break;
		}
	}

	private validate(event: KeyboardEvent, pattern: string) {
		if (this.isAllowed(event)) return;

		const { key } = event;

		const regx = new RegExp(pattern);
		if (!regx.test(key)) event.preventDefault();
	}

	private validateDNI(event: KeyboardEvent) {
		if (this.isAllowed(event)) return;
		const key = event.key.toUpperCase();
		if (this.value.length >= 11) return event.preventDefault();

		const letter_regex = /[EVJ]/;
		const number_regex = /[0-9]/;
		const start_regex = /[EVJ]{1,1}\-/;

		const is_letter = letter_regex.test(key);
		const is_number = number_regex.test(key);
		const is_hyphen = key === '-';

		if (is_letter) {
			event.preventDefault();
			if (!this.value) return (this.value = key + '-');
		}
		if (is_hyphen) {
			if (this.value.includes('-')) return event.preventDefault();
			if (!this.value) return event.preventDefault();
			return;
		}
		if (is_number && start_regex.test(this.value)) return;
		event.preventDefault();
	}

	private isAllowed(event: KeyboardEvent) {
		const { key, metaKey, ctrlKey } = event;
		if (metaKey || ctrlKey) return true;

		const alloweds = this.ALLOWEDS_KEYS;
		return alloweds.includes(key);
	}
}
