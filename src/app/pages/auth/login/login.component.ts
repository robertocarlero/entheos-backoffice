import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	public hide = true;
	public matcher = new MyErrorStateMatcher();
	public form = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(6),
		]),
	});

	constructor(
		private auth: AuthService,
		private router: Router,
		private utils: Utils
	) {}

	public onGoogleButtonsClick() {
		this.signInWhitGoogle();
	}

	public onFacebookButtonsClick() {
		this.signInWhitFacebook();
	}

	public onFormSubmit() {
		this.signInWhitEmail();
	}

	private async signInWhitEmail() {
		const loading = await this.utils.loading.present('Signing in...');
		try {
			if (this.form.invalid) throw 'Invalid form!';
			const { email, password } = this.form.value;
			const message = await this.auth.signInWithEmail(email, password);
			loading.dismiss();
			this.utils.toast.present(message);
			this.router.navigateByUrl('/home');
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private async signInWhitFacebook() {
		const loading = await this.utils.loading.present('Signing in...');
		try {
			const message = await this.auth.signInWithFacebook();
			loading.dismiss();
			this.utils.toast.present(message);
			this.router.navigateByUrl('/home');
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private async signInWhitGoogle() {
		const loading = await this.utils.loading.present('Signing in...');
		try {
			const message = await this.auth.signInWithGoogle();
			loading.dismiss();
			this.utils.toast.present(message);
			this.router.navigateByUrl('/home');
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
