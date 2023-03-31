import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { RegularExpressions } from 'src/app/core/enums/regular-expressions';
import { Member } from 'src/app/core/interfaces/member';
import { Roles } from 'src/app/core/enums/roles';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-member-form',
	templateUrl: './member-form.component.html',
	styleUrls: ['./member-form.component.scss'],
})
export class MemberFormComponent implements OnInit {
	public form = new FormGroup({
		active: new FormControl('', [Validators.required]),
		dni: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.DNI),
		]),
		email: new FormControl('', [
			Validators.email,
			Validators.pattern(RegularExpressions.EMAIL),
		]),
		firstname: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.ALPHABETIC_SPANISH),
		]),
		lastname: new FormControl('', [
			Validators.required,
			Validators.pattern(RegularExpressions.ALPHABETIC_SPANISH),
		]),
		occupation: new FormControl('', [Validators.required]),
		role: new FormControl('', [Validators.required]),
		start_date: new FormControl('', [Validators.required]),
	});

	public roles = [];
	public matcher = new MyErrorStateMatcher();

	@Input() public data: Member;

	@Output() private output = new EventEmitter();

	constructor(private users: UsersService, private utils: Utils) {}

	ngOnInit() {
		this.roles = Object.keys(Roles).map((key) => Roles[key]);

		if (!this.data) return;
		const data = {
			...this.data,
			start_date: this.data?.start_date?.toDate(),
		};
		this.form.patchValue(data);
		this.email_control.disable();
	}

	public get email_control(): FormControl {
		const email_control = this.form.get('email') as FormControl;
		return email_control;
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
			await this.checkEmail();
			await this.checkDni();
			this.utils.confirm
				.present('Are you sure to save the member information?')
				.subscribe((confirm) => {
					if (!confirm) return false;
					const data = this.utils.object.clean(this.form.value);
					this.saveData({ ...this.data, ...data });
				});
		} catch (error) {
			console.log(error);
			this.utils.toast.present(error);
		}
	}

	private checkEmail(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			if (this.email_control.pristine) return resolve('Email is valid.');
			const email = this.email_control.value;
			const email_in_use = await this.users.emailIsAlreadyInUse(email);
			if (!email_in_use) return resolve('Email is valid.');
			this.email_control.setErrors({ inUse: true });
			reject('Email is already in use.');
		});
	}

	private checkDni(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const dni_control = this.form.get('dni') as FormControl;
			if (dni_control.pristine) return resolve('DNI is valid.');
			const dni = dni_control.value;
			if (dni === this.data?.dni) return resolve('DNI is valid.');
			const dni_in_use = await this.users.dniIsAlreadyInUse(dni);
			if (!dni_in_use) return resolve('DNI is valid.');
			dni_control.setErrors({ inUse: true });
			reject('DNI is already in use.');
		});
	}

	private async saveData(data: any) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.users.setOne(data, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
