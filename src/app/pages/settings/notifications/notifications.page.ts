import { ModalUtil } from './../../../core/utils/modal-util';
import { NotificationFormModalComponent } from './../../../shared/components/modals/notification-form-modal/notification-form-modal.component';
import { UserService } from 'src/app/core/services/user.service';
import { TopicsService } from 'src/app/core/services/topics.service';
import { Component } from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.page.html',
	styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
	constructor(
		public topicsServices: TopicsService,
		public userService: UserService,
		private modals: ModalUtil
	) {}

	public onAddButtonClick() {
		this.presentFormModal();
	}

	private async presentFormModal() {
		this.modals.present(NotificationFormModalComponent);
	}
}
