import {
	Component,
	OnInit,
	OnChanges,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import { Sale } from 'src/app/core/interfaces/sale';
import { SalesService } from 'src/app/core/services/sales.service';

@Component({
	selector: 'app-product-single-item-watcher',
	templateUrl: './product-single-item-watcher.component.html',
	styleUrls: ['./product-single-item-watcher.component.scss'],
})
export class ProductSingleItemWatcherComponent implements OnInit, OnChanges {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public customIcon: string;

	@Input() public id: Product['id'];

	@Output() private custom = new EventEmitter();

	public data: Sale;

	constructor(private sales: SalesService) {}

	ngOnInit() {
		this.getData();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes?.id?.firstChange) return;
		const id = changes?.id?.currentValue;
		if (!id) return;
		this.getData();
	}

	public onCustomActionEmit() {
		this.custom.emit();
	}

	private getData() {
		this.sales.getOne(this.id).subscribe((res) => {
			this.data = res;
		});
	}
}
