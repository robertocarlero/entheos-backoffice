import firebase from 'firebase/app';

import { GenerateId } from './../utils/generate-id';
import { TransactionsList } from './../classes/lists/transactions.list';
import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { DBCrud } from 'src/app/core/classes/db-crud';

import { List } from 'src/app/core/interfaces/list';
import { Response } from '../interfaces/response';
import { Device } from '../interfaces/device';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TransactionsService extends DBCrud {
	public readonly all: List = new TransactionsList();

	protected PATH = this.app.PATH_MONEY;

	constructor(private app: AppService) {
		super();
	}

	public getAllByDevice(device_id: Device['id']) {
		const response = new Subject<any>();
		this.db
			.collection(this.PATH)
			.where('device_id', '==', device_id)
			.onSnapshot((res) => {
				const data: any = res.docs.map((doc) => this.transformDoc(doc));
				response.next(data);
			});
		return response.asObservable();
	}

	public getOne(id: string) {
		return this.get(id);
	}

	public setOne(data: any, image?: any, id?: string): Promise<Response> {
		return new Promise(async (resolve, reject) => {
			try {
				const doc_id = id || GenerateId();
				if (image) {
					const path = `${this.PATH}/${doc_id}/image`;
					data['image'] = await this.storage.create(path, image);
				}
				const user = await this.getCurrentUser();

				if (!id) {
					data['created_by'] = user.uid;
					data['created_date'] = firebase.firestore.Timestamp.now();
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

	public deleteOne(id: string) {
		return this.delete(id);
	}
}
