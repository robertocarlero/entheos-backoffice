import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { RegularExpressions } from 'src/app/core/enums/regular-expressions';
import { Member } from 'src/app/core/interfaces/member';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';
import { Capitalize } from 'src/app/core/utils/capitalize';

@Component({
	selector: 'app-account',
	templateUrl: './account.page.html',
	styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
	public form = new FormGroup({
		birthday: new FormControl('', [Validators.required]),
		dni: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.DNI),
		]),
		firstname: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.ALPHABETIC_SPANISH),
		]),
		lastname: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.ALPHABETIC_SPANISH),
		]),
		member_id: new FormControl({ value: '', disabled: true }),
		occupation: new FormControl({ value: '', disabled: true }),
		phoneNumber: new FormControl(''),
		whatsappNumber: new FormControl(''),
		address: new FormControl(''),
		gender: new FormControl(''),
	});
	public matcher = new MyErrorStateMatcher();

	constructor(
		private user: UserService,
		private utils: Utils,
		private users: UsersService
	) {}

	ngOnInit() {
		this.setDataInForm(this.user.profile);
		this.user?.profile$?.subscribe((res: Member) => {
			this.setDataInForm(res);
		});
	}

	public onFormSubmit() {
		this.sendForm();
	}

	public onSaveButtonClick() {
		this.form.markAllAsTouched();
		this.sendForm();
	}

	private setDataInForm(data: Member) {
		if (!data) return this.form.patchValue({});
		const body = {
			...data,
			birthday: data?.birthday?.toDate(),
			occupation: Capitalize(data?.occupation),
		};
		this.form.patchValue(body);
	}

	private async sendForm() {
		try {
			if (this.form.invalid) throw 'Invalid form!';
			await this.checkDni();
			this.utils.confirm
				.present('Are you sure to save the information?')
				.subscribe((confirm) => {
					if (!confirm) return false;
					const data = this.utils.object.clean(this.form.value);
					this.saveData(data);
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
			if (dni === this.user?.profile?.dni)
				return resolve('DNI is valid.');
			const dni_in_use = await this.users.dniIsAlreadyInUse(dni);
			if (!dni_in_use) return resolve('DNI is valid.');
			dni_control.setErrors({ inUse: true });
			reject('DNI is already in use.');
		});
	}

	private async saveData(data: any) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.user.updateData(data);
			loading.dismiss();
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
