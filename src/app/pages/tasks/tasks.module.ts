import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalUtil } from 'src/app/core/utils/modal-util';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TasksPageRoutingModule,
		SharedModule,
	],
	declarations: [TasksPage],
	providers: [ModalUtil],
})
export class TasksPageModule {}
