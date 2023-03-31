import { Injectable } from '@angular/core';
import { DBCrud } from '../classes/db-crud';
import { AppService } from './app.service';
import firebase from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class TasksService extends DBCrud {
	protected PATH = this.app.PATH_TASKS;

	constructor(private app: AppService) {
		super();
	}

	public getOne(id: string) {
		return this.get(id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}

	public setOne(data: any, id?: string) {
		const date = data?.schedule ? new Date(data?.schedule) : new Date();
		const body = {
			...data,
			schedule: firebase.firestore.Timestamp.fromDate(date),
			completed: !!data?.completed,
		};
		return this.set(body, id);
	}

	public setCompletedState(value: boolean, id?: string) {
		return new Promise(async (resolve, reject) => {
			try {
				if (typeof id !== 'string')
					throw 'An unexpected error occurred, please try again.';
				const data = { completed: value };
				await this.set(data, id);
				resolve('Completed status changed successfully.');
			} catch (error) {
				reject(error);
			}
		});
	}
}
