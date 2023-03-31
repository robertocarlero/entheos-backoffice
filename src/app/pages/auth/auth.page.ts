import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.page.html',
	styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
	public section = 'login';

	constructor(public menu: MenuController) {}

	ionViewWillEnter() {
		this.menu.enable(false);
	}

	ionViewWillLeave() {
		this.menu.enable(true);
	}
}
