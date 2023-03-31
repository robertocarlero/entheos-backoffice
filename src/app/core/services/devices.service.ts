import { Injectable } from '@angular/core';
import { DBCrud } from '../classes/db-crud';
import { List } from '../interfaces/list';
import { Response } from '../interfaces/response';
import { GenerateId } from '../utils/generate-id';
import { AppService } from './app.service';
import { DeviceStatuses } from '../enums/device-statuses';
import { DevicesList } from '../classes/lists/devices.list';
import firebase from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class DevicesService extends DBCrud {
	public readonly all: List = new DevicesList();
	protected PATH = this.app.PATH_DEVICES;

	constructor(private app: AppService) {
		super();
	}

	public getOne(id: string) {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, image?: any, id?: string): Promise<Response> {
		return new Promise(async (resolve, reject) => {
			try {
				const doc_id = id || GenerateId();
				const user = await this.getCurrentUser();
				data['changed_by'] = user.uid;
				data['last_changed_date'] = firebase.firestore.Timestamp.now();

				if (!id) {
					data['admission_date'] = firebase.firestore.Timestamp.now();
					data['status'] = DeviceStatuses.IN_LINE;
					data['created_by'] = user.uid;
					data['created_date'] = firebase.firestore.Timestamp.now();
				}
				if (image) {
					const path = `${this.PATH}/${doc_id}/image`;
					data['image'] = await this.storage.create(path, image);
				}
				const res = await this.set(data, doc_id);
				const body = { ...data, id: doc_id };
				if (!id) this.dispatchEvent(body);
				resolve(res);
			} catch (error) {
				reject('There was an error trying to save the information.');
			}
		});
	}
}
