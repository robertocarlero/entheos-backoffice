import { MessagingService } from './services/messaging.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Providers */
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { CustomersService } from './services/customers.service';
import { DevicesService } from './services/devices.service';
import { QuotesService } from './services/quotes.service';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';
import { TopicsService } from './services/topics.service';

/* Pipes */
import { CustomIdPipe } from './pipes/custom-id.pipe';
import { ReplacePipe } from './pipes/replace.pipe';

/* Directives */
import { InputImageDirective } from './directives/input-image.directive';
import { InputTypeDirective } from './directives/input-type.directive';

/* Utils */
import { Utils } from './utils';
import { ConfirmUtil } from './utils/confirm-util';
import { LoadingUtil } from './utils/loading-util';
import { ModalUtil } from './utils/modal-util';
import { ToastUtil } from './utils/toast-util';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [CommonModule, HttpClientModule],
	declarations: [
		/* Pipes */
		CustomIdPipe,
		ReplacePipe,
		/* Directives */
		InputImageDirective,
		InputTypeDirective,
	],
	exports: [
		/* Pipes */
		CustomIdPipe,
		ReplacePipe,
		/* Directives */
		InputImageDirective,
		InputTypeDirective,
	],
	providers: [
		/* Providers */
		AppService,
		AuthService,
		CustomersService,
		DevicesService,
		QuotesService,
		UserService,
		UsersService,
		MessagingService,
		TopicsService,
		/* Utils */
		Utils,
		ConfirmUtil,
		LoadingUtil,
		ModalUtil,
		ToastUtil,
	],
})
export class CoreModule {}
