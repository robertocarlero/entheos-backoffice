import { Input } from '@angular/core';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { List } from 'src/app/core/interfaces/list';
import { User } from 'src/app/core/interfaces/user';
import { Utils } from 'src/app/core/utils';
import { DevicesSingleListModalComponent } from '../../modals/devices-single-list-modal/devices-single-list-modal.component';

@Component({
	selector: 'app-input-device',
	templateUrl: './input-device.component.html',
	styleUrls: ['./input-device.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputDeviceComponent),
			multi: true,
		},
	],
})
export class InputDeviceComponent implements OnInit, ControlValueAccessor {
	@Input() public line = false;
	@Input() public title = 'User';
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public list: List;

	public device_id: User['id'];

	constructor(private utils: Utils) {}

	ngOnInit() {}

	writeValue(value: any): void {
		if (value === this.device_id) return;
		this.device_id = value;
	}

	registerOnChange(method: any): void {
		this.onChange = method;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	registerOnTouched(method: any): void {
		return;
	}

	public onChange(_: any) {}

	public onCustomActionEmit() {
		this.utils.confirm
			.present('Are you shure to clean this field?')
			.subscribe((result) => {
				if (!result) return;
				this.onChange('');
			});
	}

	public onSetUserButtonClick() {
		if (this.disabled) return;
		this.openUserSelecterList();
	}

	private async openUserSelecterList() {
		const data = this.list;
		const result: User = await this.utils.modal.getResult(
			DevicesSingleListModalComponent,
			{ data }
		);
		if (!result) return;
		this.device_id = result?.id;
		this.onChange(result?.id);
	}
}
