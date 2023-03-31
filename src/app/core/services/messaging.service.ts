import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

import 'firebase/messaging';

import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class MessagingService {
	private messaging = firebase.messaging.isSupported()
		? firebase.messaging()
		: null;

	private _token = null;

	constructor(private user: UserService) {
		this.setToken();
		this.getMessages();
	}

	public get token(): string {
		if (this._token) return this._token;
		const data = localStorage.getItem('messaging_token');
		const token = JSON.parse(data);
		return token || null;
	}

	public set token(value: string) {
		this._token = value;
		const _data = JSON.stringify(value);
		localStorage.setItem('messaging_token', _data);
	}

	public async requestPermission() {
		if (!this.messaging) return;
		const token = await this.messaging.getToken();
		this.token = token;
		return token;
	}

	public deleteToken() {
		if (!this.messaging) return;
		return new Promise(async (resolve) => {
			try {
				const token = this.token;
				if (!token) resolve(null);

				const devices = this.user?.profile?.devices || [];
				const tokenIndex = devices.indexOf(token);
				devices.splice(tokenIndex, 1);
				await this.user.updateData({ devices });
				this.token = null;
				this.messaging.deleteToken();

				resolve(null);
			} catch (error) {
				resolve(null);
			}
		});
	}

	public async setToken() {
		if (!this.messaging) return;
		const subscription = this.user?.profile$.subscribe(async (user) => {
			if (!user) return;
			subscription.unsubscribe();

			const devices = user?.devices || [];

			const token = this.token || (await this.requestPermission());

			if (!token) return;
			if (devices?.includes(token)) return;

			this.user.updateData({
				devices: [...devices, token],
			});
		});
	}

	private getMessages() {
		if (!this.messaging) return;
		this.messaging.onMessage(({ notification }) => {
			new Notification(notification.title, notification);
		});
	}
}
