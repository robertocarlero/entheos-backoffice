import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastUtil } from 'src/app/core/utils/toast-util';

@Component({
	selector: 'app-recover-password',
	templateUrl: './recover-password.component.html',
	styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent {
	public email = new FormControl('', [Validators.required, Validators.email]);
	public matcher = new MyErrorStateMatcher();

	@Output() private sent = new EventEmitter();

	constructor(private auth: AuthService, private toast: ToastUtil) {}

	public onFormSubmit() {
		this.sendRecoverPasswordEmail();
	}

	public async sendRecoverPasswordEmail() {
		try {
			if (this.email.invalid) throw 'Invalid form!';
			const message = await this.auth.recoverPassword(this.email.value);
			this.sent.emit(true);
			this.toast.present(message);
		} catch (message) {
			this.toast.present(message);
		}
	}
}
