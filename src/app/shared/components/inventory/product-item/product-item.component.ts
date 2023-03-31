import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';

import { Utils } from 'src/app/core/utils';
import { IonItemSliding } from '@ionic/angular';
import { Product } from 'src/app/core/interfaces/product';
import { ProductsService } from '../../../../core/services/products.service';
import { UserService } from '../../../../core/services/user.service';
import { ProductFormModalComponent } from '../../modals/product-form-modal/product-form-modal.component';

@Component({
	selector: 'app-product-item',
	templateUrl: './product-item.component.html',
	styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Product;
	@Output() private output = new EventEmitter();

	constructor(
		private utils: Utils,
		private products: ProductsService,
		public user: UserService
	) {}

	ngOnInit() {}

	public get image(): string {
		const image = this.data?.image;
		if (!image) return '';
		if (!image?.url_thumb) return image?.url || '';
		return image?.url_thumb;
	}

	public onClick() {
		this.output.emit();
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.item.open('end');
	}

	public onEraseOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.deleteProduct(this.data);
	}

	public onEditOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.presentProductFormModal();
	}

	private async presentProductFormModal() {
		const props = {
			data: this.data,
		};
		this.utils.modal.present(ProductFormModalComponent, props);
	}

	private deleteProduct(product: Product) {
		this.utils.confirm
			.present(
				'Are you sure you want to delete this product?',
				product?.product_id?.toString()
			)
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				try {
					const message = await this.products.deleteOne(product.id);
					this.utils.toast.present(message);
				} catch (message) {
					this.utils.toast.present(message);
				}
			});
	}
}
