import { AlertController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

export class ConfirmUtil {
	private alertController = new AlertController();

	constructor() {}

	public present(message: string, header = 'Confirm'): Observable<any> {
		const response = new Subject<any>();
		const create = async () => {
			const alert = await this.alertController.create({
				header,
				message,
				buttons: [
					{
						text: 'Cancel',
						role: 'cancel',
						cssClass: 'secondary',
						handler: () => {
							response.next(false);
						},
					},
					{
						text: 'Confirm',
						handler: () => {
							response.next(true);
						},
					},
				],
			});
			await alert.present();
		};
		create();
		return response.asObservable();
	}
}
