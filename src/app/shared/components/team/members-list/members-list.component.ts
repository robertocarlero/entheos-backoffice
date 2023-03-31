import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Member } from 'src/app/core/interfaces/member';
import { UserService } from 'src/app/core/services/user.service';
import { MemberFormModalComponent } from '../../modals/member-form-modal/member-form-modal.component';

@Component({
	selector: 'app-members-list',
	templateUrl: './members-list.component.html',
	styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent extends ListComponent {
	@Output() private output = new EventEmitter<Member>();

	constructor(
		private modalController: ModalController,
		public user: UserService
	) {
		super();
	}

	public onOneMemberOutput(member: Member) {
		this.output.emit(member);
	}

	public onAddButtonClick() {
		if (!this.user?.isAdmin) return;
		this.presentFormModal();
	}

	private async presentFormModal() {
		const modal = await this.modalController.create({
			component: MemberFormModalComponent,
		});
		await modal.present();
	}
}
