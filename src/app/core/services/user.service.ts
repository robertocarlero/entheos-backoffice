import { Amount } from './../interfaces/amount';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable, Subject } from 'rxjs';
import { DBCrud } from '../classes/db-crud';
import { Response } from '../interfaces/response';
import { Member } from '../interfaces/member';

@Injectable({
	providedIn: 'root',
})
export class UserService extends DBCrud {
	protected PATH = this.app.PATH_USERS;

	private DATA: Member;
	private DATA$ = new Subject<Member>();

	constructor(private app: AppService) {
		super();
	}

	public get profile(): Member {
		return this.DATA;
	}

	public get balance(): Amount {
		return this.DATA?.balance;
	}

	public get profile$(): Observable<Member> {
		setTimeout(() => {
			if (this.DATA) this.DATA$.next(this.DATA);
		}, 0);
		return this.DATA$.asObservable();
	}

	public get isAdmin(): boolean {
		return this.DATA?.role === 'admin';
	}

	public get isEditor(): boolean {
		return this.DATA?.role === 'editor';
	}

	private set data(value: Member) {
		this.DATA = value;
		this.DATA$.next(value);
	}

	public updateImage(file: any, type: 'banner' | 'avatar'): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const { uid } = this.fauth?.currentUser;
				if (!uid) return reject('You must log in first.');
				const path = `team/${type}s/${uid}`;
				const image = await this.storage.create(path, file);
				await this.set({ [type]: image }, uid);
				resolve('The image was updated successfully.');
			} catch (error) {
				reject('We were unable to update the image.');
			}
		});
	}

	public updateData(data: any): Promise<Response> {
		return new Promise<Response>(async (resolve, reject) => {
			try {
				const { uid } = this.fauth?.currentUser;
				const res = await this.set(data, uid);
				resolve(res);
			} catch (error) {
				reject(error);
			}
		});
	}

	protected initialize() {
		this.subscribeUser();
	}

	private async subscribeUser() {
		this.fauth.onAuthStateChanged((user) => {
			if (!user) return (this.data = null);
			this.get(user.uid).subscribe((res: Member) => {
				this.data = res;
			});
		});
	}
}
