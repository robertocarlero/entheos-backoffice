import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { Member } from 'src/app/core/interfaces/member';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-phone-form',
	templateUrl: './phone-form.component.html',
	styleUrls: ['./phone-form.component.scss'],
})
export class PhoneFormComponent implements OnInit {
	public sended = false;
	public form = new FormGroup({
		phoneNumber: new FormControl({ value: '', disabled: true }, [
			Validators.required,
		]),
		code: new FormControl(''),
	});
	public matcher = new MyErrorStateMatcher();

	constructor(
		public auth: AuthService,
		private utils: Utils,
		private modals: ModalController,
		private user: UserService
	) {}

	ngOnInit() {
		this.user?.profile$?.subscribe((res: Member) => {
			if (!res) return this.form.patchValue({});
			this.form.patchValue(res);
		});
		const data = this.user?.profile;
		if (!data) return this.form.patchValue({});
		this.form.patchValue(data);
	}

	public onButtonClick() {
		const phone_control = this.form.get('phoneNumber') as FormControl;
		phone_control.markAsTouched();
		if (this.form.invalid) return this.utils.toast.present('Invalid form!');
		const { phone, code } = this.form.value;
		if (!this.sended) return this.sendPhoneVerification(phone);
		this.comfirmPhoneNumber(code);
	}

	private async comfirmPhoneNumber(code: number) {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.auth.comfirmPhoneNumber(code.toString());
			this.modals.dismiss();
			loading.dismiss();
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private async sendPhoneVerification(phoneNumber: string) {
		const phone_control = this.form.get('phoneNumber') as FormControl;
		const code_control = this.form.get('code') as FormControl;
		phone_control.disable();
		code_control.setValidators([
			Validators.required,
			Validators.minLength(6),
		]);
		this.form.updateValueAndValidity();
		const loading = await this.utils.loading.present();
		try {
			const message = await this.auth.sendPhoneVerification(
				`+57${phoneNumber}`
			);
			this.sended = true;
			loading.dismiss();
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
