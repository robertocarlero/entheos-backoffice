import { Component, Input } from '@angular/core';
import { List } from '../../interfaces/list';

@Component({
	providers: [],
	template: '',
})
export abstract class ListComponent {
	@Input() public data: List;
	@Input() public search = true;

	constructor() {}

	public async onScrollShot(event) {
		await this.data.next();
		event.target.complete();
	}

	public onSearchbarOutput(event: any) {
		const query = event?.detail?.value;
		this.data.search(query);
	}
}
