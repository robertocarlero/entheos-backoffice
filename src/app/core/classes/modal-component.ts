import { ModalController } from '@ionic/angular';
import { AppInjector } from '../utils/app-injector';

export class ModalComponent {
	protected modalController: ModalController;

	constructor() {
		this.modalController = AppInjector.get(ModalController);
	}

	public onCloseButtonClick() {
		this.closeModal();
	}

	protected closeModal(data?: any, role?: string) {
		this.modalController.dismiss(data, role);
	}
}
