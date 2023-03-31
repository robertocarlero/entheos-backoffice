import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomersPageRoutingModule } from './customers-routing.module';

import { CustomersPage } from './customers.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { Utils } from 'src/app/core/utils';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CustomersPageRoutingModule,
		SharedModule,
	],
	declarations: [CustomersPage],
	providers: [Utils],
})
export class CustomersPageModule {}
