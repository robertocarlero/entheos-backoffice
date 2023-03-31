import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabPageRoutingModule } from './lab-routing.module';

import { LabPage } from './lab.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LabPageRoutingModule,
		SharedModule,
	],
	declarations: [LabPage],
})
export class LabPageModule {}
