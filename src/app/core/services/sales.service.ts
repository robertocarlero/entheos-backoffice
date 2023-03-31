import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { List } from '../interfaces/list';
import { DBCrud } from '../classes/db-crud';
import { GenerateId } from '../utils/generate-id';
import { Response } from '../interfaces/response';
import { SalesList } from '../classes/lists/sales/sales.list';
import { ItemSelled } from '../interfaces/item-selled';
import { Product } from '../interfaces/product';
import firebase from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class SalesService extends DBCrud {
	public readonly all: List = new SalesList();
	protected PATH = this.app.PATH_SALES;

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
					await this.validateStock(data?.products);
				}
				const res = await this.set(data, doc_id);
				const body = { ...data, id: doc_id };
				if (!id) this.dispatchEvent(body);
				resolve(res);
			} catch (error) {
				console.error(error);
				const message =
					typeof error === 'string'
						? error
						: 'There was an error trying to save the information.';
				reject(message);
			}
		});
	}

	private validateStock(data: ItemSelled[]): Promise<string> {
		return new Promise((resolve, reject) => {
			data?.forEach(async (item: ItemSelled, index: number) => {
				const { product, quantity } = item;
				const res = await this.db
					.collection(this.app?.PATH_PRODUCTS)
					.doc(product?.id)
					.get();
				const body = res.data() as Product;
				if (quantity > body?.stock)
					reject(`Not enough stock for ${product?.name}`);
				if (index < data.length - 1) return;
				resolve('Yes there is enough stock for each product');
			});
		});
	}
}
