import { ModalController } from '@ionic/angular';
import { AppInjector } from './app-injector';

export class ModalUtil {
	private modals: ModalController;

	constructor() {
		this.modals = AppInjector.get(ModalController);
	}

	public getResult(component: any, data?: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const modal = await this.present(component, data);
				const result = await modal.onDidDismiss();
				resolve(result?.data);
			} catch (error) {
				reject(error);
			}
		});
	}

	public present(component: any, props?: any): Promise<HTMLIonModalElement> {
		return new Promise(async (resolve, reject) => {
			try {
				const modal = await this.modals.create({
					component,
					componentProps: props,
				});
				await modal.present();
				resolve(modal);
			} catch (error) {
				reject(error);
			}
		});
	}
}
