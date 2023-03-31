import {
	Component,
	EventEmitter,
	Output,
	ViewChild,
	OnInit,
} from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

@Component({
	selector: 'app-searchbar',
	templateUrl: './searchbar.component.html',
	styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
	@ViewChild('searchbar') public searchbar: IonSearchbar;
	@Output() private output = new EventEmitter();

	constructor() {}

	ngOnInit() {
		setTimeout(() => this.searchbar.setFocus(), 1000);
	}

	public onSearchbarChange(event: any) {
		this.emitChange(event);
	}

	private emitChange(data: any) {
		this.output.emit(data);
	}
}
