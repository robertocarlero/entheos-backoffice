import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Product } from 'src/app/core/interfaces/product';
import { UserService } from 'src/app/core/services/user.service';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { ProductFormModalComponent } from '../../modals/product-form-modal/product-form-modal.component';

@Component({
	selector: 'app-products-list',
	templateUrl: './products-list.component.html',
	styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent extends ListComponent {
	@Input() public fixed = false;
	@Input() public add = true;
	@Input() public color = 'light';

	@Output() private output = new EventEmitter<Product>();

	constructor(private modals: ModalUtil, public user: UserService) {
		super();
	}

	public onOneItemOutput(data: Product) {
		this.output.emit(data);
	}

	public onAddButtonClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin) return;
		this.presentFormModal();
	}

	private async presentFormModal() {
		this.modals.present(ProductFormModalComponent);
	}
}
