import { Utils } from './../../../../core/utils/index';
import { MyErrorStateMatcher } from './../../../../core/classes/my-error-state-matcher';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
	selector: 'app-notification-form',
	templateUrl: './notification-form.component.html',
	styleUrls: ['./notification-form.component.scss'],
})
export class NotificationFormComponent {
	public form = new FormGroup({
		topic: new FormControl('general', [Validators.required]),
		notification: new FormGroup({
			title: new FormControl('', [Validators.required]),
			body: new FormControl('', [Validators.required]),
		}),
	});

	@Output() private output = new EventEmitter();

	constructor(
		private utils: Utils,
		private notifications: NotificationsService
	) {}

	public matcher = new MyErrorStateMatcher();
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
					'Are you sure to send this notification?',
					this.form?.value?.name
				)
				.subscribe((confirm) => {
					if (!confirm) return false;
					this.saveData(this.form.value);
				});
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async saveData(data: any) {
		const loading = await this.utils.loading.present();
		try {
			await this.notifications.setOne(data);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present('Notification sent successfully.');
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
