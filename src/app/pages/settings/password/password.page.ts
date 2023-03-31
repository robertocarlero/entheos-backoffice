import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-password',
	templateUrl: './password.page.html',
	styleUrls: ['./password.page.scss'],
})
export class PasswordPage {
	public hidepass = true;
	public form = new FormGroup({
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(6),
		]),
		password_confirm: new FormControl('', [
			Validators.required,
			Validators.minLength(6),
		]),
	});
	public matcher = new MyErrorStateMatcher();

	constructor(
		private auth: AuthService,
		private utils: Utils,
		private router: Router
	) {}

	public onFormSubmit() {
		this.processForm();
	}

	private processForm() {
		try {
			const { value, invalid } = this.form;
			if (invalid) throw '¡Formulario inválido!';
			const data = this.utils.object.clean(value);
			const passwords_match = data.password === data.password_confirm;
			if (!passwords_match)
				throw 'Las contraseñas no coinciden entre sí.';
			this.changePassword(data.password);
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async changePassword(data) {
		try {
			const message = await this.auth.updatePassword(data);
			this.form.reset();
			this.router.navigate(['/account', 'profile']);
			this.utils.toast.present(message);
		} catch (message) {
			this.utils.toast.present(message);
		}
	}
}
