import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabPage } from './lab.page';

const routes: Routes = [
	{
		path: '',
		component: LabPage,
	},
	{
		path: ':device_id',
		loadChildren: () =>
			import('./device-detail/device-detail.module').then(
				(m) => m.DeviceDetailPageModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LabPageRoutingModule {}
