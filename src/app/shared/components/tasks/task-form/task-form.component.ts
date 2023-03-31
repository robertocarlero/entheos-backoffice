import { DevicesList } from 'src/app/core/classes/lists/devices.list';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
import { List } from 'src/app/core/interfaces/list';
import { Member } from 'src/app/core/interfaces/member';
import { Task } from 'src/app/core/interfaces/task';
import { CustomersService } from 'src/app/core/services/customers.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-task-form',
	templateUrl: './task-form.component.html',
	styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, OnChanges {
	public form = new FormGroup({
		color: new FormControl('', [Validators.required]),
		customer_id: new FormControl(''),
		description: new FormControl(''),
		device_id: new FormControl(''),
		notify: new FormControl(true, [Validators.required]),
		member_id: new FormControl('', [Validators.required]),
		schedule: new FormControl(''),
		title: new FormControl('', [Validators.required]),
	});

	public devices_list: List;
	public today = new Date();

	public matcher = new MyErrorStateMatcher();

	@Input() public data: Task;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	@Output() private output = new EventEmitter();

	constructor(
		private tasks: TasksService,
		private utils: Utils,
		public customers: CustomersService,
		public devices: DevicesService,
		public users: UsersService,
		public user: UserService
	) {}

	ngOnInit() {
		this.setDataInForm();
		this.subscribeToControlsChanges();
		this.devices_list = this.devices.all;
	}

	ngOnChanges(changes: SimpleChanges) {
		const customer = changes?.customer?.currentValue;
		if (!!customer) {
			const control = this.form.get('customer_id') as FormControl;
			control.setValue(customer);
		}
		const device = changes?.device?.currentValue;
		if (!!device) {
			const control = this.form.get('device_id') as FormControl;
			control.setValue(device);
		}
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
				this.saveData(data);
			});
	}

	private async saveData(data: any) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.tasks.setOne(data, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private setDataInForm() {
		if (!this.data?.member_id) {
			const control = this.form.get('member_id') as FormControl;
			control.setValue(this.user?.profile?.id);
			this.user.profile$.subscribe((user: Member) => {
				if (control.pristine) return;
				control.setValue(user?.id);
			});
		}
		if (!this.data?.schedule) {
			const control = this.form.get('schedule') as FormControl;
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			control.setValue(tomorrow.toISOString());
		}
		if (!this.data) return;
		const data = {
			...this.data,
			schedule: this.data?.schedule?.toDate()?.toISOString(),
		};
		this.form.patchValue(data);
	}

	private subscribeToControlsChanges() {
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
}
