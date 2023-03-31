import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnDestroy,
	Optional,
	Self,
	ViewChild,
} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NgControl,
	Validators,
} from '@angular/forms';
import {
	MAT_FORM_FIELD,
	MatFormField,
	MatFormFieldControl,
} from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { RegularExpressions } from 'src/app/core/enums/regular-expressions';

@Component({
	selector: 'app-input-tel',
	templateUrl: './input-tel.component.html',
	styleUrls: ['./input-tel.component.scss'],
	providers: [
		{ provide: MatFormFieldControl, useExisting: InputTelComponent },
	],
})
export class InputTelComponent
	implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy
{
	static ngAcceptInputTypeDISABLED: boolean | string | null | undefined;
	static ngAcceptInputTypeREQUIRED: boolean | string | null | undefined;
	static nextId = 0;

	public parts: FormGroup;
	public stateChanges = new Subject<void>();
	public focused = false;
	public controlType = 'tel-input';

	private PLACEHOLDER: string;
	private REQUIRED = false;
	private DISABLED = false;

	@HostBinding('id') public id = `tel-input-${InputTelComponent.nextId++}`;

	@ViewChild('area') public areaInput: ElementRef;
	@ViewChild('exchange') public exchangeInput: ElementRef;
	@ViewChild('subscriber') public subscriberInput: ElementRef;

	onChange = (_: any) => {};
	onTouched = () => {};

	get empty() {
		const {
			value: { area, exchange, subscriber },
		} = this.parts;

		return !area && !exchange && !subscriber;
	}

	@HostBinding('class.floating')
	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}

	@Input()
	get placeholder(): string {
		return this.PLACEHOLDER;
	}
	set placeholder(value: string) {
		this.PLACEHOLDER = value;
		this.stateChanges.next();
	}

	@Input()
	get required(): boolean {
		return this.REQUIRED;
	}
	set required(value: boolean) {
		this.REQUIRED = coerceBooleanProperty(value);
		this.stateChanges.next();
	}

	@Input()
	get disabled(): boolean {
		return this.DISABLED;
	}
	set disabled(value: boolean) {
		this.DISABLED = coerceBooleanProperty(value);
		this.DISABLED ? this.parts.disable() : this.parts.enable();
		this.stateChanges.next();
	}

	@Input()
	get value(): string | null {
		if (this.parts.valid) {
			const { area, exchange, subscriber } = this.parts.value;
			return [area, exchange, subscriber].join('-');
		}
		return null;
	}
	set value(value: string | null) {
		const tel = typeof value === 'string' ? value.split('-') : ['', '', ''];
		this.parts.setValue({
			area: tel[0] || '',
			exchange: tel[1] || '',
			subscriber: tel[2] || '',
		});
		this.stateChanges.next();
	}

	get currentValue(): string | null {
		const { area, exchange, subscriber } = this.parts.value;
		return [area, exchange, subscriber].join('');
	}

	get errorState(): boolean {
		if (!this.required && !this.currentValue) return false;

		return this.parts.invalid && this.parts.touched;
	}

	constructor(
		formBuilder: FormBuilder,
		private FOCUS__MONITOR: FocusMonitor,
		private ELEMENT_REF: ElementRef<HTMLElement>,
		@Optional() @Inject(MAT_FORM_FIELD) public FORM_FIELD: MatFormField,
		@Optional() @Self() public ngControl: NgControl
	) {
		this.parts = formBuilder.group({
			area: [
				null,
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(3),
					Validators.pattern(RegularExpressions.NUMBER),
				],
			],
			exchange: [
				null,
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(3),
					Validators.pattern(RegularExpressions.NUMBER),
				],
			],
			subscriber: [
				null,
				[
					Validators.required,
					Validators.minLength(4),
					Validators.maxLength(4),
					Validators.pattern(RegularExpressions.NUMBER),
				],
			],
		});

		FOCUS__MONITOR.monitor(ELEMENT_REF, true).subscribe((origin) => {
			if (this.focused && !origin) {
				this.onTouched();
			}
			this.focused = !!origin;
			this.stateChanges.next();
		});

		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
		setTimeout(() => {
			this.listenForPasteEvent();
		}, 0);
	}

	focus() {
		this.areaInput.nativeElement.focus();
	}

	autoFocusNext(
		control: AbstractControl,
		nextElement?: HTMLInputElement
	): void {
		if (!control.errors && nextElement) {
			this.FOCUS__MONITOR.focusVia(nextElement, 'program');
		}
	}

	autoFocusPrev(
		control: AbstractControl,
		prevElement: HTMLInputElement
	): void {
		if (control.value.length < 1) {
			this.FOCUS__MONITOR.focusVia(prevElement, 'program');
		}
	}

	ngOnDestroy() {
		this.stateChanges.complete();
		this.FOCUS__MONITOR.stopMonitoring(this.ELEMENT_REF);
	}

	setDescribedByIds(ids: string[]) {
		const controlElement = this.ELEMENT_REF.nativeElement.querySelector(
			'.tel-input-container'
		);
		controlElement?.setAttribute('aria-describedby', ids.join(' '));
	}

	onContainerClick() {
		if (this.parts.controls.subscriber.valid) {
			this.FOCUS__MONITOR.focusVia(this.subscriberInput, 'program');
		} else if (this.parts.controls.exchange.valid) {
			this.FOCUS__MONITOR.focusVia(this.subscriberInput, 'program');
		} else if (this.parts.controls.area.valid) {
			this.FOCUS__MONITOR.focusVia(this.exchangeInput, 'program');
		} else {
			this.FOCUS__MONITOR.focusVia(this.areaInput, 'program');
		}
	}

	writeValue(tel: string | null): void {
		this.value = tel;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	_handleInput(
		control: AbstractControl,
		nextElement?: HTMLInputElement
	): void {
		this.autoFocusNext(control, nextElement);
		this.onChange(this.value);
	}

	public onCopyButtonClick() {
		this.copyValueInClipboard();
	}

	private copyValueInClipboard(): void {
		const REGX = /(\d+)/g;
		const { area, exchange, subscriber } = this.parts.value;
		const value = [area || '', exchange || '', subscriber || ''].join('-');
		const VALID_VALUE = value.match(REGX).join('');
		navigator.clipboard.writeText(VALID_VALUE);
	}

	private listenForPasteEvent(): void {
		const listen = (control: ElementRef) => {
			control.nativeElement.addEventListener('paste', (event) => {
				const PASTE = event?.clipboardData?.getData('text');
				this.setValue(PASTE);
			});
		};
		listen(this.areaInput);
		listen(this.exchangeInput);
		listen(this.subscriberInput);
	}

	private setValue(value: string): void {
		const REGX = /(\d+)/g;
		const VALID_VALUE = value?.match(REGX)?.join('') || [];
		const CHARSTS = [...VALID_VALUE];
		CHARSTS.splice(3, 0, '-');
		CHARSTS.splice(7, 0, '-');
		const NEW_VALUE = CHARSTS.join('');
		this.value = NEW_VALUE;
	}
}
