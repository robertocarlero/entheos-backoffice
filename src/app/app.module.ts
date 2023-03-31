import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { setAppInjector } from './core/utils/app-injector';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/app';
import 'firebase/app';
import { ServiceWorkerModule } from '@angular/service-worker';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		CommonModule,
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		SharedModule,
		MaterialModule,
		ServiceWorkerModule.register('combined-sw.js', {
			enabled: environment.production,
		}),
	],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(injector: Injector) {
		setAppInjector(injector);
	}
}
