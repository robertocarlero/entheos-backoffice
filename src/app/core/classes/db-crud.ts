import { Observable, Subject } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { GenerateId } from '../utils/generate-id';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Response } from '../interfaces/response';

export abstract class DBCrud {
	protected PATH = '';
	protected db = firebase.firestore();
	protected fauth = firebase.auth();
	protected storage = new StorageService();

	constructor() {
		setTimeout(() => {
			this.initialize();
		}, 0);
	}

	protected initialize() {}

	protected set(data: any, id?: string, path = this.PATH): Promise<Response> {
		return new Promise(async (resolve, reject) => {
			try {
				const doc_id = id || GenerateId();
				const user = await this.getCurrentUser();
				data['changed_by'] = user.uid;
				data['last_changed_date'] = firebase.firestore.Timestamp.now();
				if (!id) {
					data['created_by'] = user.uid;
					data['created_date'] = firebase.firestore.Timestamp.now();
				}
				delete data?.id;
				const ref = this.db.doc(`${path}/${doc_id}`);
				await ref.set(data, { merge: true });
				const body = { ...data, id: doc_id };
				if (!id) this.dispatchEvent(body);
				const message = 'The information was saved successfully.';
				resolve({ data: body, message });
			} catch (error) {
				console.error(error);
				reject('There was an error trying to save the information');
			}
		});
	}

	protected delete(id: string, path = this.PATH): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.getCurrentUser();
				await this.db.doc(`${path}/${id}`).delete();
				resolve('The information was successfully removed.');
			} catch (error) {
				reject('There was an error trying to delete the information.');
			}
		});
	}

	protected get(id: string, path = this.PATH): Observable<any> {
		const response = new Subject<any>();
		this.db.doc(`${path}/${id}`).onSnapshot((doc) => {
			if (!doc.exists) return response.next(null);
			response.next(this.transformDoc(doc));
		});
		return response.asObservable();
	}

	public setFile(file: any, path = this.PATH, data?: any): Promise<Response> {
		return new Promise(async (resolve, reject) => {
			try {
				const id = GenerateId();
				const _path = `${path}/${id}`;
				const body = await this.storage.create(_path, file);
				const response = await this.set({ ...body, ...data }, id, path);
				response.message = 'File saved successfully.';
				resolve(response);
			} catch (error) {
				reject('There was an error trying to save the file.');
			}
		});
	}

	public deleteFile(id: string, path = this.PATH): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.delete(id, path);
				resolve('File deleted successfully.');
			} catch (error) {
				reject('There was an error trying to delete the file.');
			}
		});
	}

	protected getAll(path = this.PATH): Observable<Array<any>> {
		const response = new Subject<Array<any>>();
		this.db.collection(path).onSnapshot((res) => {
			const data: any = res.docs.map((doc) => this.transformDoc(doc));
			response.next(data);
		});
		return response.asObservable();
	}

	protected getCurrentUser(): Promise<firebase.User> {
		return new Promise(async (resolve, reject) => {
			const user = this.fauth.currentUser;
			if (!!user) return resolve(user);
			reject('You need to login first.');
		});
	}

	protected transformDoc(doc: firebase.firestore.DocumentData): any {
		return {
			...doc.data(),
			id: doc.id,
		};
	}

	protected dispatchEvent(data: any) {
		window.dispatchEvent(
			new CustomEvent('db-event', {
				detail: {
					data,
					collection: this.PATH,
				},
			})
		);
	}
}
