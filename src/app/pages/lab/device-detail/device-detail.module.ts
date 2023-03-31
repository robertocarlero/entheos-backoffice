import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceDetailPageRoutingModule } from './device-detail-routing.module';

import { DeviceDetailPage } from './device-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DeviceDetailPageRoutingModule,
		SharedModule,
	],
	declarations: [DeviceDetailPage],
})
export class DeviceDetailPageModule {}
