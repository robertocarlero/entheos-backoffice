import { MessagingService } from './core/services/messaging.service';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Roles } from './core/enums/roles';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	public items = [
		{
			title: 'home',
			url: '/home',
			icon: 'anchor',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
		{
			title: 'dashboard',
			url: '/dashboard',
			icon: 'bong',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
		{
			title: 'lab',
			url: '/lab',
			icon: 'flask',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
		{
			title: 'customers',
			url: '/customers',
			icon: 'user-astronaut',
			roles: [Roles.ADMIN, Roles.EDITOR],
		},
		{
			title: 'team',
			url: '/team',
			icon: 'user-secret',
			roles: [Roles.ADMIN],
		},
		{
			title: 'inventory',
			url: '/inventory',
			icon: 'cookie-bite',
			roles: [Roles.ADMIN],
		},
		{
			title: 'sales',
			url: '/sales',
			icon: 'store',
			roles: [Roles.ADMIN],
		},
		{
			title: 'tasks',
			url: '/tasks',
			icon: 'thumbtack',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
		{
			title: 'Money',
			url: '/money',
			icon: 'money-bill-transfer',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
		// {
		// 	title: 'notifications',
		// 	url: '/notifications',
		// 	icon: 'bell',
		//  roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER]
		// },
		{
			title: 'account',
			url: '/settings/account',
			icon: 'hat-cowboy',
			roles: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER],
		},
	];

	public dark = false;
	public display_padding = false;

	constructor(
		public user: UserService,
		private menu: MenuController,
		private auth: AuthService,
		private messaging: MessagingService
	) {
		this.initializeApp();
	}

	private async initializeApp() {
		this.messaging.requestPermission();

		this.auth.user$.subscribe((user) => {
			this.menu.enable(!!user);
			this.display_padding = !!user;
		});
	}
}
