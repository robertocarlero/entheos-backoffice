import { AlertController } from '@ionic/angular';

export class AlertUtil {
	private alertController = new AlertController();

	constructor() {}

	public present(
		message: string,
		header = 'Message'
	): Promise<HTMLIonAlertElement> {
		return new Promise(async (resolve) => {
			const alert = await this.alertController.create({
				header,
				message,
				buttons: [
					{
						text: 'OK',
						cssClass: 'secondary',
					},
				],
			});
			await alert.present();
			resolve(alert);
		});
	}
}
