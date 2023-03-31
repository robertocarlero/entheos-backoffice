import { ToastController } from '@ionic/angular';

export class ToastUtil {
	private toastController = new ToastController();

	constructor() {}

	public async present(
		message: string,
		duration?: number,
		position?: 'bottom' | 'middle' | 'top'
	) {
		const toast = await this.toastController.create({
			message,
			duration: duration || 3000,
			position: position || 'bottom',
		});
		toast.present();
	}
}
