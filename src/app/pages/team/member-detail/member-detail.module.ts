import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from './../../../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberDetailPageRoutingModule } from './member-detail-routing.module';

import { MemberDetailPage } from './member-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterFormComponent } from './filter-form/filter-form.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		MemberDetailPageRoutingModule,
		SharedModule,
		MaterialModule,
		CoreModule,
	],
	declarations: [MemberDetailPage, FilterFormComponent],
})
export class MemberDetailPageModule {}
