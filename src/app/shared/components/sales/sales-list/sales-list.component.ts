import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ListComponent } from '../../../../core/classes/lists/list-component';
import { Sale } from '../../../../core/interfaces/sale';
import { SaleFormModalComponent } from '../../modals/sale-form-modal/sale-form-modal.component';
import { ModalUtil } from '../../../../core/utils/modal-util';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	selector: 'app-sales-list',
	templateUrl: './sales-list.component.html',
	styleUrls: ['./sales-list.component.scss'],
})
export class SalesListComponent extends ListComponent {
	@Input() public fixed = false;
	@Input() public add = true;
	@Input() public color = 'light';

	@Output() private output = new EventEmitter<Sale>();

	constructor(private modals: ModalUtil, public user: UserService) {
		super();
	}

	public onOneItemOutput(data: Sale) {
		this.output.emit(data);
	}

	public onAddButtonClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin) return;
		this.presentFormModal();
	}

	private async presentFormModal() {
		this.modals.present(SaleFormModalComponent);
	}
}
