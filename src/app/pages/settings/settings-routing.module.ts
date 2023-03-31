import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
	{
		path: '',
		component: SettingsPage,
	},
	{
		path: 'email',
		loadChildren: () =>
			import('./email/email.module').then((m) => m.EmailPageModule),
	},
	{
		path: 'password',
		loadChildren: () =>
			import('./password/password.module').then(
				(m) => m.PasswordPageModule
			),
	},
	{
		path: 'account',
		loadChildren: () =>
			import('./account/account.module').then((m) => m.AccountPageModule),
	},
	{
		path: 'notifications',
		loadChildren: () =>
			import('./notifications/notifications.module').then(
				(m) => m.NotificationsPageModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
