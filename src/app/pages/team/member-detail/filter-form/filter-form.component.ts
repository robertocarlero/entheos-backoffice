import {
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';

import { DevicesListFilters } from 'src/app/core/interfaces/devices-list-filters';

import { DeviceDates } from 'src/app/core/enums/devices-dates';
import { DeviceStatuses } from 'src/app/core/enums/device-statuses';

@Component({
	selector: 'app-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent implements OnInit {
	@Output() private output = new EventEmitter<DevicesListFilters>();

	public form = new FormGroup({
		statuses: new FormControl([]),
		date_from: new FormControl(''),
		date_to: new FormControl(''),
		order_by: new FormControl(''),
	});
	public inputControl = new FormControl('');
	public matcher = new MyErrorStateMatcher();
	public dates_types = Object.values(DeviceDates);

	private _items: string[] = [];
	private _filteredItems: string[] = [];

	@ViewChild('inputText') fruitInput: ElementRef<HTMLInputElement>;

	constructor() {}

	ngOnInit() {
		this.initialize();
	}

	public get filteredItems() {
		return this._filteredItems;
	}

	public set filteredItems(values: string[]) {
		const newValue = values;
		newValue.sort();
		this._filteredItems = newValue;
	}

	public get items(): string[] {
		return this._items;
	}

	private initialize() {
		this.filteredItems = Object.values(DeviceStatuses);

		this.form.valueChanges.subscribe((value) => {
			this.output.emit(value);
		});

		this.inputControl.valueChanges.subscribe((value) => {
			const newValue = (value || '').toLowerCase().trim();
			const items = Object.values(DeviceStatuses);

			const validItems = items.filter(
				(item) => !this.items.includes(item)
			);

			this.filteredItems = !newValue
				? validItems
				: validItems.filter((item) => item.includes(newValue));
		});
	}

	public set items(items: string[]) {
		this._items = items;

		const statusControl = this.form.get('statuses') as FormControl;
		statusControl.setValue(items);
	}

	public onMatChipInputTokenEnd(event: MatChipInputEvent): void {
		this.add(event?.value);
	}

	public onOptionSelected(event: MatAutocompleteSelectedEvent): void {
		this.add(event?.option?.value);
	}

	public onRemoved(event: string) {
		this.remove(event);
	}

	private remove(item: string): void {
		const index = this.items.indexOf(item);

		if (index >= 0) {
			const newValue = this.items;
			this.filteredItems = [...this.filteredItems, item];
			newValue.splice(index, 1);
			this.items = newValue;
		}
	}

	private add(value): void {
		const newValue = (value || '').trim();
		const index = this.filteredItems.indexOf(newValue);

		if (index >= 0) {
			const newFilterdItems = this.filteredItems;
			newFilterdItems.splice(index, 1);
			this.filteredItems = newFilterdItems;

			if (newValue) this.items = [...this.items, newValue];
			this.inputControl.setValue(null);
			this.fruitInput.nativeElement.value = '';
		}
	}
}
