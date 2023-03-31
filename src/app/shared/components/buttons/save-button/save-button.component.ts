import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-save-button',
	templateUrl: './save-button.component.html',
	styleUrls: ['./save-button.component.scss'],
})
export class SaveButtonComponent implements OnInit {
	@Input() public icon = 'save';
	@Input() public size = 'small';
	@Input() public disabled = false;
	@Input() public color = 'primary';

	constructor() {}

	ngOnInit() {}
}
