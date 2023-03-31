import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { CoreModule } from '../core/core.module';

import { COMPONENTS } from './components/components';

import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		CoreModule,
	],
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS],
	providers: [SMS, AndroidPermissions],
})
export class SharedModule {}
