import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Member } from 'src/app/core/interfaces/member';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';
import { MemberFormModalComponent } from '../../modals/member-form-modal/member-form-modal.component';

@Component({
	selector: 'app-member-item',
	templateUrl: './member-item.component.html',
	styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Member;
	@Output() private output = new EventEmitter<Member>();

	constructor(
		private utils: Utils,
		private modalController: ModalController,
		private users: UsersService,
		public user: UserService
	) {}

	ngOnInit() {}

	public get image(): string {
		const avatar = this.data?.avatar;
		if (!avatar) return '';
		if (!avatar?.url_thumb) return avatar?.url || '';
		return avatar?.url_thumb;
	}

	public onClick() {
		this.output.emit(this.data);
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		if (!this.user?.isAdmin) return;
		this.item.open('end');
	}

	public onEraseOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.deleteMember(this.data);
	}

	public onEditOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.presentMemberFormModal(this.data);
	}

	private async presentMemberFormModal(data: any) {
		const modal = await this.modalController.create({
			component: MemberFormModalComponent,
			componentProps: { data },
		});

		await modal.present();
	}

	private deleteMember(member: Member) {
		this.utils.confirm
			.present(
				'Are you sure you want to delete this member?',
				member.name
			)
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				try {
					const message = await this.users.deleteOne(member.id);
					this.utils.toast.present(message);
				} catch (message) {
					this.utils.toast.present(message);
				}
			});
	}
}
