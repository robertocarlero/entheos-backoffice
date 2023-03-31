import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-image-button',
	templateUrl: './image-button.component.html',
	styleUrls: ['./image-button.component.scss'],
})
export class ImageButtonComponent {
	@Input() public icon = 'camera';
	@Input() public size = 'small';
	@Input() public color = 'primary';

	@Output() private output = new EventEmitter<File>();

	constructor() {}

	public onOutputImage(image: File) {
		this.output.emit(image);
	}
}
