import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { IsAdminGuard } from '../core/guards/is-admin.guard';
import { IsEditorGuard } from '../core/guards/is-editor.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomePageModule),

		canActivate: [AuthGuard],
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthPageModule),

		canActivate: [AuthGuard],
	},
	{
		path: 'customers',
		loadChildren: () =>
			import('./customers/customers.module').then(
				(m) => m.CustomersPageModule
			),
		canLoad: [AuthGuard, IsEditorGuard],
		canActivate: [AuthGuard, IsEditorGuard],
	},
	{
		path: 'team',
		loadChildren: () =>
			import('./team/team.module').then((m) => m.TeamPageModule),
		canLoad: [AuthGuard, IsAdminGuard],
		canActivate: [AuthGuard, IsAdminGuard],
	},
	{
		path: 'lab',
		loadChildren: () =>
			import('./lab/lab.module').then((m) => m.LabPageModule),
		canLoad: [AuthGuard, IsEditorGuard],
		canActivate: [AuthGuard, IsEditorGuard],
	},
	{
		path: 'settings',
		loadChildren: () =>
			import('./settings/settings.module').then(
				(m) => m.SettingsPageModule
			),
		canLoad: [AuthGuard],
		canActivate: [AuthGuard],
	},
	{
		path: 'tasks',
		loadChildren: () =>
			import('./tasks/tasks.module').then((m) => m.TasksPageModule),
		canLoad: [AuthGuard],
		canActivate: [AuthGuard],
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then(
				(m) => m.DashboardPageModule
			),
		canLoad: [AuthGuard],
		canActivate: [AuthGuard],
	},
	{
		path: 'inventory',
		loadChildren: () =>
			import('./inventory/inventory.module').then(
				(m) => m.InventoryPageModule
			),
		canLoad: [AuthGuard, IsAdminGuard],
		canActivate: [AuthGuard, IsAdminGuard],
	},
	{
		path: 'sales',
		loadChildren: () =>
			import('./sales/sales.module').then((m) => m.SalesPageModule),
	},
	{
		path: 'money',
		loadChildren: () =>
			import('./money/money.module').then((m) => m.MoneyPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
