import { Component, forwardRef, OnInit } from '@angular/core';
import { Colors } from '../../../../core/enums/colors';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
	selector: 'app-input-color',
	templateUrl: './input-color.component.html',
	styleUrls: ['./input-color.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputColorComponent),
			multi: true,
		},
	],
})
export class InputColorComponent implements OnInit, ControlValueAccessor {
	public control = new FormControl('');
	public disabled = false;

	public colors = [
		Colors.RED,
		Colors.PURPLE,
		Colors.BLUE,
		Colors.GREEN,
		Colors.GRAY,
		Colors.BLACK,
		Colors.YELLOW,
		Colors.ORANGE,
	];

	public selected: string;
	public custom: string;

	constructor() {}

	ngOnInit() {
		this.subscribeControlToChanges();
		this.selected = this.colors[0];
		setTimeout(() => {
			this.onChange(this.selected);
		}, 0);
	}

	writeValue(value: Colors) {
		if (typeof value !== 'string') return;
		const exsist = this.colors.indexOf(value) >= 0;
		if (!exsist) return (this.custom = value);
		this.selected = value || this.colors[0];
		this.onChange(this.selected);
	}

	registerOnChange(method: any): void {
		this.onChange = method;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	registerOnTouched(method: any): void {
		this.control.markAsTouched();
	}

	public onChange(_: any) {}

	public onOneItemClick(color: string) {
		this.selected = color;
		this.custom = null;
		this.onChange(color);
	}

	private subscribeControlToChanges() {
		this.control.valueChanges.subscribe((value: string) => {
			this.selected = null;
			this.custom = value;
			this.onChange(value);
		});
	}
}
