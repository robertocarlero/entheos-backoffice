import { AppNotification } from './../interfaces/notification';
import { Injectable } from '@angular/core';
import { DBCrud } from '../classes/db-crud';
import { List } from '../interfaces/list';
import { AppService } from './app.service';
import { DevicesList } from '../classes/lists/devices.list';

@Injectable({
	providedIn: 'root',
})
export class NotificationsService extends DBCrud {
	public readonly all: List = new DevicesList();
	protected PATH = this.app.PATH_NOTIFICATIONS;

	constructor(private app: AppService) {
		super();
	}

	public setOne(notification: AppNotification) {
		return this.set(notification);
	}
}
