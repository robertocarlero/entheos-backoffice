import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Member } from 'src/app/core/interfaces/member';

@Component({
	selector: 'app-member-form-modal',
	templateUrl: './member-form-modal.component.html',
	styleUrls: ['./member-form-modal.component.scss'],
})
export class MemberFormModalComponent extends ModalComponent {
	@Input() public data: Member;

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
