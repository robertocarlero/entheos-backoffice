import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-input-image',
	templateUrl: './input-image.component.html',
	styleUrls: ['./input-image.component.scss'],
})
export class InputImageComponent {
	@Input() public src = '';
	@Input() public size = 'big';
	@Output() private output = new EventEmitter<File>();

	constructor() {}

	public onOutputImage(image: File) {
		this.output.emit(image);
	}
}
