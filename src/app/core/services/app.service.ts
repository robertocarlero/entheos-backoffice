import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	/* Defaults Paths  */
	public readonly DEFAULT_PATH_IMAGES = 'images';

	/* PATHs */
	public readonly PATH_CUSTOMERS = 'customers';
	public readonly PATH_DEVICES = 'devices';
	public readonly PATH_PRODUCTS = 'products';
	public readonly PATH_SALES = 'sales';
	public readonly PATH_TASKS = 'tasks';
	public readonly PATH_USERS = 'team';
	public readonly PATH_MONEY = 'transactions';
	public readonly PATH_NOTIFICATIONS = 'notifications';
	public readonly PATH_TOPICS = 'topics';

	/* Vars */
	public readonly APP_NAME = 'EnTheos';

	public readonly PAGER_LIMIT = 20;

	public readonly PAGER_LIMIT_CUSTOMERS = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_DEVICES = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_PRODUCTS = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_SALES = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_TASKS = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_USERS = this.PAGER_LIMIT;
	public readonly PAGER_LIMIT_MONEY = this.PAGER_LIMIT;
}
