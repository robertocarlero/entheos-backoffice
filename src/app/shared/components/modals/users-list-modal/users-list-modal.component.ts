import { Component, Input } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { List } from 'src/app/core/interfaces/list';
import { User } from 'src/app/core/interfaces/user';

@Component({
	selector: 'app-users-list-modal',
	templateUrl: './users-list-modal.component.html',
	styleUrls: ['./users-list-modal.component.scss'],
})
export class UsersListModalComponent extends ModalComponent {
	@Input() public data: List;
	@Input() public selecter = true;

	constructor() {
		super();
	}

	public onListOutput(data: User) {
		if (!this.selecter) return;
		this.closeModal(data);
	}
}
