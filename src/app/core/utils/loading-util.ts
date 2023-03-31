import { LoadingController } from '@ionic/angular';

export class LoadingUtil {
	private loadingController = new LoadingController();

	public present(
		message?: string,
		duration?: number,
		spinner?:
			| 'crescent'
			| 'bubbles'
			| 'circles'
			| 'circular'
			| 'dots'
			| 'lines'
			| 'lines-small'
	): Promise<HTMLIonLoadingElement> {
		return new Promise(async (resolve, reject) => {
			const loading = await this.loadingController.create({
				message: message || 'Wait...',
				spinner: spinner || 'crescent',
				duration: duration || 60000,
			});
			await loading.present();
			resolve(loading);
		});
	}
}
