import { Component, Input, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';

import { Plugins } from '@capacitor/core';
import { User } from 'src/app/core/interfaces/user';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/core/services/app.service';

import { ToastUtil } from 'src/app/core/utils/toast-util';

const { Device } = Plugins;

@Component({
	selector: 'app-contact-buttons',
	templateUrl: './contact-buttons.component.html',
	styleUrls: ['./contact-buttons.component.scss'],
})
export class ContactButtonsComponent implements OnInit {
	public platform = '';

	@Input() public data: User;
	constructor(
		private sms: SMS,
		private androidPermissions: AndroidPermissions,
		private app: AppService,
		private toast: ToastUtil
	) {}

	ngOnInit() {
		Device.getInfo().then((info) => {
			this.platform = info.platform;
		});
	}

	public onWhatsappButtonClick() {
		if (!this.data.whatsappNumber)
			return this.toast.present(
				'The user does not have a WhatsApp number associated with it.'
			);
		this.openWhatsapp();
	}

	public onCallButtonClick() {
		if (!this.data.phoneNumber)
			return this.toast.present(
				'The user does not have a phone number associated with it.'
			);
		this.openCall();
	}

	public onSmsButtonClick() {
		if (!this.data.phoneNumber)
			return this.toast.present(
				'The user does not have a phone number associated with it.'
			);
		if (this.platform !== 'android')
			return this.toast.present(
				'This function is not supported on this platform.'
			);
		this.openMessage();
	}

	public openWhatsapp() {
		const numberphone = this.cleanNumber(this.data.whatsappNumber);
		const country_code = environment.production ? '58' : '57';
		const url = `whatsapp://send?phone=${country_code}${numberphone}`;
		document.location.href = url;
	}

	public openCall() {
		const numberphone = this.cleanNumber(this.data.phoneNumber);
		const num = environment.production ? '0' : '';
		const url = `tel:${num}${numberphone}`;
		document.location.href = url;
	}

	public async openMessage() {
		try {
			const phone_number = this.cleanNumber(this.data.phoneNumber);
			const message = `Hola ${this.data?.name}, te escribo de parte de "${this.app.APP_NAME}"`;
			const options = {
				replaceLineBreaks: false,
				android: { intent: 'INTENT' },
			};
			const hasPermission = await this.sms.hasPermission();
			if (hasPermission)
				return this.sms.send(phone_number, message, options);
			await this.androidPermissions.requestPermission(
				this.androidPermissions.PERMISSION.SEND_SMS
			);
			return this.sms.send(phone_number, message, options);
		} catch (error) {
			this.toast.present(
				'You must grant permission to use this feature.'
			);
		}
	}

	private cleanNumber(numberphone): string {
		let response = numberphone;
		response = response.trim().match(/(\d+)/g);
		response = response.join('');
		return response;
	}
}
