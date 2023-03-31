import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/utils';
import { PhoneFormModalComponent } from 'src/app/shared/components/modals/phone-form-modal/phone-form-modal.component';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
	public items = [
		{
			path: 'account',
			title: 'Update Profile',
			icon: 'person',
		},
		{
			path: 'password',
			title: 'Change Password',
			icon: 'key',
		},
		{
			path: 'email',
			title: 'Change email address',
			icon: 'at',
		},
		{
			path: 'notifications',
			title: 'Notifications',
			icon: 'notifications',
		},
	];

	constructor(
		private router: Router,
		public auth: AuthService,
		private utils: Utils
	) {}

	public get email_verified(): boolean {
		return this.auth?.currentUser?.emailVerified;
	}

	public onForgetPasswordItemClick() {
		this.utils.confirm
			.present(
				`You will be sent an email with the steps to follow, do you want to continue?`,
				'Recover password'
			)
			.subscribe((confirm) => {
				if (!confirm) return false;
				this.sendRecoverPasswordEmail();
			});
	}

	public onVerifyPhoneItemClick() {
		this.presentVerifyPhoneModal();
	}

	public onVerifyEmailItemClick() {
		this.utils.confirm
			.present(
				`You will be sent an email with the steps to follow, do you want to continue?`,
				'Verify email'
			)
			.subscribe((confirm) => {
				if (!confirm) return false;
				this.verifyEmail();
			});
	}

	public onLogoutItemClick() {
		this.logout();
	}

	private logout() {
		if (!this.auth?.authenticated) return false;
		this.utils.confirm
			.present('Are you sure you want to log out?')
			.subscribe(async (confirm) => {
				if (confirm) {
					try {
						const message = await this.auth.signOut();
						this.router.navigate(['/auth']);
						this.utils.toast.present(message);
					} catch (message) {
						this.utils.toast.present(message);
					}
				}
			});
	}

	private async verifyEmail() {
		try {
			const message = await this.auth.sendEmailVerification();
			this.utils.toast.present(message);
		} catch (message) {
			this.utils.toast.present(message);
		}
	}

	private async presentVerifyPhoneModal() {
		const result = await this.utils.modal.getResult(
			PhoneFormModalComponent
		);
		if (!result) return;
		this.auth.reload();
	}

	private async sendRecoverPasswordEmail() {
		const loading = await this.utils.loading.present();
		try {
			const { email } = this.auth.currentUser;
			if (!email) throw 'You must login first.';
			const message = await this.auth.recoverPassword(email);
			loading.dismiss();
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
