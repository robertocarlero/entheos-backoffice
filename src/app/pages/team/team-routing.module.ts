import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamPage } from './team.page';

const routes: Routes = [
	{
		path: '',
		component: TeamPage,
	},
	{
		path: ':member_id',
		loadChildren: () =>
			import('./member-detail/member-detail.module').then(
				(m) => m.MemberDetailPageModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TeamPageRoutingModule {}
