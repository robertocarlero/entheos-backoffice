import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import { File } from '../interfaces/file';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private storage = firebase.storage();

	constructor() {}

	public create(path: string, file: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const contentType = file?.type;
				const ref = this.storage.ref(path);
				await ref.put(file, {
					contentType,
				});
				const url = await ref.getDownloadURL();
				const name = ref.name;
				resolve({ name, url, path, contentType });
			} catch (error) {
				reject(error);
			}
		});
	}
}
