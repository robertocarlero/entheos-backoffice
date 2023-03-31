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
import { CustomersService } from 'src/app/core/services/customers.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-device-form',
	templateUrl: './device-form.component.html',
	styleUrls: ['./device-form.component.scss'],
})
export class DeviceFormComponent implements OnInit, OnChanges {
	public form = new FormGroup({
		model: new FormControl('', [Validators.required]),
		brand: new FormControl('', [Validators.required]),
		code: new FormControl('', [Validators.required]),
		serial: new FormControl('', [Validators.required]),
		type: new FormControl('', [Validators.required]),
		color: new FormControl('#000000', [Validators.required]),
		description: new FormControl('', [Validators.required]),
		customer_id: new FormControl('', [Validators.required]),
		details: new FormControl(''),
	});

	public img: any;
	public img_url: string;
	public matcher = new MyErrorStateMatcher();

	@Input() public data: Device;
	@Input() public customer: Customer['id'];

	@Output() private output = new EventEmitter();

	constructor(
		private devices: DevicesService,
		public customers: CustomersService,
		private utils: Utils
	) {}

	ngOnInit() {
		if (!this.data) return;
		this.form.patchValue(this.data);
		this.img_url = this.data?.image?.url_thumb || this.data?.image?.url;
	}

	ngOnChanges(changes: SimpleChanges) {
		const customer = changes?.customer?.currentValue;
		if (!customer) return;
		const control = this.form.get('customer_id') as FormControl;
		control.setValue(customer);
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
		try {
			if (this.form.invalid) throw 'Invalid form!';
			this.utils.confirm
				.present(
					'Are you sure to save the device information?',
					this.form?.value?.name
				)
				.subscribe((confirm) => {
					if (!confirm) return false;
					const data = {
						...this.data,
						...this.form.value,
					};
					this.saveData(data, this.img);
				});
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async saveData(data: any, image: File) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.devices.setOne(data, image, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
