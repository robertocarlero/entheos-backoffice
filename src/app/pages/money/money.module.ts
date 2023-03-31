import { MaterialModule } from 'src/app/shared/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoneyPageRoutingModule } from './money-routing.module';

import { MoneyPage } from './money.page';
import { FilterFormComponent } from './filter-form/filter-form.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		MoneyPageRoutingModule,
		SharedModule,
		CoreModule,
		MaterialModule,
	],
	declarations: [MoneyPage, FilterFormComponent],
})
export class MoneyPageModule {}
