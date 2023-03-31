import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';

@Component({
	selector: 'app-user-avatar',
	templateUrl: './user-avatar.component.html',
	styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
	@Input() public data: User;
	constructor() {}

	public get image(): string {
		const avatar = this.data?.avatar;
		if (!avatar) return '';
		if (!avatar?.url_thumb) return avatar?.url || '';
		return avatar?.url_thumb;
	}
}
