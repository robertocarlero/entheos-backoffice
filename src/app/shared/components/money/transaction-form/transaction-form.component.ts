import { DevicesList } from 'src/app/core/classes/lists/devices.list';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core/services/users.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { CustomersService } from 'src/app/core/services/customers.service';
import { Utils } from 'src/app/core/utils';
import { TransactionsService } from './../../../../core/services/transactions.service';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { List } from 'src/app/core/interfaces/list';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { Transaction } from 'src/app/core/interfaces/transaction';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
import { TransactionsTypes } from 'src/app/core/enums/transaction-types';

@Component({
	selector: 'app-transaction-form',
	templateUrl: './transaction-form.component.html',
	styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
	public form = new FormGroup({
		amount: new FormGroup({
			value: new FormControl('', [Validators.required]),
			coin: new FormControl('USD', [Validators.required]),
		}),
		type: new FormControl('', [Validators.required]),
		color: new FormControl('', [Validators.required]),
		customer_id: new FormControl(''),
		device_id: new FormControl(''),
		entry_balance: new FormControl(''),
		out_balance: new FormControl(''),
		date: new FormControl(''),
		description: new FormControl(''),
	});

	public devices_list: List;
	public img: any;
	public img_url: string;
	public matcher = new MyErrorStateMatcher();

	public types: TransactionsTypes[] = [];

	@Input() public data: Transaction;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	@Output() private output = new EventEmitter();

	constructor(
		private transactions: TransactionsService,
		private utils: Utils,
		public customers: CustomersService,
		public devices: DevicesService,
		public users: UsersService,
		public user: UserService
	) {}

	public get typeControl(): FormControl {
		const control = this.form.get('type') as FormControl;
		return control;
	}

	public get entryBalanceIsVisible() {
		const { value } = this.typeControl;
		if (!value) return false;
		if (value === TransactionsTypes.SPENT) return false;
		if (value === TransactionsTypes.PURCHASE) return false;
		return true;
	}

	public get outBalanceIsVisible() {
		const { value } = this.typeControl;
		if (!value) return false;
		if (value === TransactionsTypes.ENTRY) return false;
		return true;
	}

	ngOnInit() {
		this.setDataInForm();
		this.subscribeToControlsChanges();
		this.devices_list = this.devices.all;
	}

	ngOnChanges(changes: SimpleChanges) {
		const { customer, device } = changes;
		this.setControlValue('customer_id', customer?.currentValue);
		this.setControlValue('device_id', device?.currentValue);

		const types = Object.values(TransactionsTypes);

		if (device?.currentValue || customer?.currentValue) {
			const index = types.indexOf(TransactionsTypes.PAY);
			types.splice(index, 1);
		}

		this.types = types;
	}

	public onInputImageOutput(file: File) {
		this.img = file;
		this.img_url = URL.createObjectURL(file);
	}

	public onFormSubmit() {
		this.sendForm();
	}

	public onSaveButtonClick() {
		this.form.markAllAsTouched();
		this.sendForm();
	}

	private sendForm() {
		if (this.form.invalid) return this.utils.toast.present('Invalid form!');
		this.utils.confirm
			.present('Are you sure to save the task information?')
			.subscribe((confirm) => {
				if (!confirm) return false;
				let data = this.form.value;
				data = this.utils.object.clean(data);
				this.saveData({ ...this.data, ...data }, this.img);
			});
	}

	private async saveData(data: any, image: File) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.transactions.setOne(
				data,
				image,
				this.data?.id
			);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private setDataInForm() {
		if (!this.data) return;
		const fields = ['amount', 'type', 'entry_balance', 'out_balance'];

		fields.forEach((field) => {
			const control = this.form.get(field) as FormControl;
			control.disable();
		});

		if (this.data?.type) {
			const control = this.form.get('type') as FormControl;
			control.disable();
		}
		const data = {
			...this.data,
			date: this.data?.date?.toDate() || new Date(),
		};
		this.form.patchValue(data);
	}

	private subscribeToControlsChanges() {
		this.chekTypeControlChanges();
		this.chekCustomerControlChanges();
		this.chekDeviceControlChanges();
	}

	private chekTypeControlChanges() {
		this.typeControl.valueChanges.subscribe(() => {
			if (this.outBalanceIsVisible && this.entryBalanceIsVisible) {
				this.removeControlValidators('customer_id');
				this.removeControlValidators('device_id');
			}

			if (this.outBalanceIsVisible) {
				this.setControlAsRequired('out_balance');
			} else {
				this.removeControlValidators('out_balance');
			}

			if (this.entryBalanceIsVisible) {
				this.setControlAsRequired('entry_balance');
			} else {
				this.removeControlValidators('entry_balance');
			}
		});
	}

	private chekCustomerControlChanges() {
		const customer_control = this.form.get('customer_id') as FormControl;
		const device_control = this.form.get('device_id') as FormControl;

		customer_control.valueChanges.subscribe((value) => {
			if (!value) return (this.devices_list = this.devices.all);
			this.devices_list = new DevicesList(undefined, {
				customer_id: value,
			});
			const device_id = device_control.value;
			if (!device_id) return;
			this.devices.getOne(device_id).subscribe((res: Device) => {
				if (value === res?.customer_id) return;
				device_control.setValue('');
				device_control.updateValueAndValidity();
			});
		});
	}

	private chekDeviceControlChanges() {
		const customer_control = this.form.get('customer_id') as FormControl;
		const device_control = this.form.get('device_id') as FormControl;

		device_control.valueChanges.subscribe((value) => {
			if (!value) return;
			this.devices.getOne(value).subscribe((res: Device) => {
				const customer_id = customer_control.value;
				if (customer_id === res?.customer_id) return;
				customer_control.setValue(res?.customer_id);
				customer_control.updateValueAndValidity();
			});
		});
	}

	private setControlAsRequired(controlName: string) {
		const control = this.form.get(controlName) as FormControl;
		control.setValidators(Validators.required);
		control.updateValueAndValidity();
	}

	private removeControlValidators(controlName: string) {
		const control = this.form.get(controlName) as FormControl;
		control.setValue(null);
		control.clearAsyncValidators();
		control.clearValidators();
		control.updateValueAndValidity();
	}

	private setControlValue(controlName: string, value: any) {
		const control = this.form.get(controlName) as FormControl;
		control.setValue(value);
		control.updateValueAndValidity();
	}
}
