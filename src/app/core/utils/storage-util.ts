import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class StorageUtil {
	constructor() {}

	public async set(data: any, path: any): Promise<any> {
		return new Promise((resolve) => {
			const _data = JSON.stringify(data);
			localStorage.setItem(path, _data);
			resolve(true);
		});
	}

	public get(path: string): Promise<any> {
		return new Promise((resolve) => {
			const data: string = localStorage.getItem(path);
			const _data = JSON.parse(data);
			resolve(_data);
		});
	}

	public delete(path: string): Promise<any> {
		return new Promise((resolve) => {
			localStorage.removeItem(path);
			resolve(true);
		});
	}

	public clear() {
		localStorage.clear();
	}
}
