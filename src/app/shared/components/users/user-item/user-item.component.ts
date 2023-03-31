import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';

@Component({
	selector: 'app-user-item',
	templateUrl: './user-item.component.html',
	styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;

	@Input() public data: User;

	constructor() {}
}
