import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { RegularExpressions } from 'src/app/core/enums/regular-expressions';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomersService } from 'src/app/core/services/customers.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-customer-form',
	templateUrl: './customer-form.component.html',
	styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
	public form = new FormGroup({
		name: new FormControl('', [Validators.required]),
		email: new FormControl('', [
			Validators.email,
			Validators.pattern(RegularExpressions.EMAIL),
		]),
		birthday: new FormControl(''),
		phoneNumber: new FormControl(''),
		whatsappNumber: new FormControl(''),
		dni: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.DNI),
		]),
		address: new FormControl(''),
		gender: new FormControl(''),
		additional_info: new FormControl(''),
	});

	public img: any;
	public img_url: string;
	public matcher = new MyErrorStateMatcher();

	@Input() public data: Customer;

	@Output() private output = new EventEmitter();

	constructor(private customers: CustomersService, private utils: Utils) {}

	ngOnInit() {
		if (!this.data) return;
		const data = {
			...this.data,
			birthday: this.data?.birthday?.toDate(),
		};
		this.form.patchValue(data);
		const avatar = this.data?.avatar;
		this.img_url = avatar?.url_thumb || avatar?.url;
	}

	public onInputImageOutput(file: File) {
		this.img = file;
		this.img_url = URL.createObjectURL(file);
	}

	public onDniInputBlur() {
		this.checkDni();
	}

	public onFormSubmit() {
		this.sendForm();
	}

	public onSaveButtonClick() {
		this.form.markAllAsTouched();
		this.sendForm();
	}

	private async sendForm() {
		try {
			if (this.form.invalid) throw 'Invalid form!';
			await this.checkDni();
			this.utils.confirm
				.present(
					'Are you sure to save the customer information?',
					this.form?.value?.name
				)
				.subscribe((confirm) => {
					if (!confirm) return;
					const data = this.utils.object.clean(this.form.value);
					data.email = data.email.toLowerCase();
					this.saveData({ ...this.data, ...data }, this.img);
				});
		} catch (error) {
			console.log(error);
			this.utils.toast.present(error);
		}
	}

	private checkDni(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const dni_control = this.form.get('dni') as FormControl;
			if (dni_control.pristine) return resolve('DNI is valid.');
			const dni = dni_control.value;
			if (dni === this.data?.dni) return resolve('DNI is valid.');
			const dni_in_use = await this.customers.dniIsAlreadyInUse(dni);
			if (!dni_in_use) return resolve('DNI is valid.');
			dni_control.setErrors({ inUse: true });
			reject('DNI is already in use.');
		});
	}

	private async saveData(data: any, image: File) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.customers.setOne(data, image, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
