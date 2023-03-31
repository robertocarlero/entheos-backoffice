import { Input } from '@angular/core';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { List } from 'src/app/core/interfaces/list';
import { User } from 'src/app/core/interfaces/user';
import { Utils } from 'src/app/core/utils';
import { UsersListModalComponent } from '../../modals/users-list-modal/users-list-modal.component';

@Component({
	selector: 'app-input-user',
	templateUrl: './input-user.component.html',
	styleUrls: ['./input-user.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputUserComponent),
			multi: true,
		},
	],
})
export class InputUserComponent implements OnInit, ControlValueAccessor {
	@Input() public line = false;
	@Input() public title = 'User';
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public list: List;

	public user_id: User['id'];

	constructor(private utils: Utils) {}

	ngOnInit() {}

	writeValue(value: any): void {
		if (value === this.user_id) return;
		this.user_id = value;
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

	public onSetUserButtonClick() {
		if (this.disabled) return;
		this.openUserSelecterList();
	}

	private async openUserSelecterList() {
		const data = this.list;
		const result: User = await this.utils.modal.getResult(
			UsersListModalComponent,
			{ data }
		);
		if (!result) return;
		this.user_id = result?.id;
		this.onChange(result?.id);
	}
}
