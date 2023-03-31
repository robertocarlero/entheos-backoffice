import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { User } from 'src/app/core/interfaces/user';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent extends ListComponent {
	@Input() public line = true;
	@Input() public detail = true;
	@Input() public button = true;

	@Output() private output = new EventEmitter<User>();

	constructor() {
		super();
	}

	public onOneItemClick(user: User) {
		this.output.emit(user);
	}
}
