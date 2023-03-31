import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-email',
	templateUrl: './email.page.html',
	styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {
	public form = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		email_confirm: new FormControl('', [
			Validators.required,
			Validators.email,
		]),
	});
	public matcher = new MyErrorStateMatcher();

	constructor(
		private auth: AuthService,
		private utils: Utils,
		private router: Router
	) {}

	ngOnInit() {}

	public onFormSubmit() {
		this.processForm();
	}

	private processForm() {
		try {
			const { value, invalid } = this.form;
			if (invalid) throw 'Invalid form!';
			const data = this.utils.object.clean(value);
			const emails_match = data.email === data.email_confirm;
			if (!emails_match)
				throw 'The email addresses do not match each other.';
			this.changeEmail(data.email.toLowerCase());
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async changeEmail(data: string) {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.auth.updateEmail(data);
			this.form.reset();
			loading.dismiss();
			this.router.navigate(['/settings']);
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
