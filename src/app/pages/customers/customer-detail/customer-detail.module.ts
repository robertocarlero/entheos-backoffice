import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerDetailPageRoutingModule } from './customer-detail-routing.module';

import { CustomerDetailPage } from './customer-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalUtil } from 'src/app/core/utils/modal-util';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CustomerDetailPageRoutingModule,
		SharedModule,
	],
	declarations: [CustomerDetailPage],
	providers: [ModalUtil],
})
export class CustomerDetailPageModule {}
