import { Injectable } from '@angular/core';
import { UsersDBCrud } from '../classes/users-db-crud';
import { List } from '../interfaces/list';
import { AppService } from './app.service';
import { MembersList } from '../classes/lists/users/members.list';

@Injectable({
	providedIn: 'root',
})
export class UsersService extends UsersDBCrud {
	public readonly all: List = new MembersList();
	public readonly active: List = new MembersList(true);

	protected PATH = this.app.PATH_USERS;

	constructor(private app: AppService) {
		super();
	}

	public getOne(id: string) {
		return this.get(id);
	}

	public setOne(data: any, id: string) {
		return this.set(data, id);
	}

	public deleteOne(id: string) {
		return this.delete(id);
	}
}
