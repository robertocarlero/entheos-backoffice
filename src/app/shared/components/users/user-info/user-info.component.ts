import { Component, Input, OnInit } from '@angular/core';
import { Image } from 'src/app/core/interfaces/image';
import { User } from 'src/app/core/interfaces/user';

@Component({
	selector: 'app-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
	@Input() public data: User;

	constructor() {}

	public get image(): string {
		if (!this.data) return '';
		const avatar: Image = this.data.avatar;
		if (!avatar) return '';
		if (!avatar.url_thumb) return avatar.url || '';
		return avatar.url_thumb;
	}
}
