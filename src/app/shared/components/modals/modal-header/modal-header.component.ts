import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-modal-header',
	templateUrl: './modal-header.component.html',
	styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
	@Input() public color = 'light';
	@Input() public title = '';

	@Output() private close = new EventEmitter();

	constructor() {}

	public onCloseButtonClick() {
		this.close.emit();
	}
}
