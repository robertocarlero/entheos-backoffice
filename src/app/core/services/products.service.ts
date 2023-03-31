import { Injectable } from '@angular/core';
import { List } from '../interfaces/list';
import { ProductsList } from '../classes/lists/products/products.list';
import { AppService } from './app.service';
import { DBCrud } from '../classes/db-crud';
import { GenerateId } from '../utils/generate-id';
import { Response } from '../interfaces/response';
import firebase from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class ProductsService extends DBCrud {
	public readonly all: List = new ProductsList();
	protected PATH = this.app.PATH_PRODUCTS;

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
}
