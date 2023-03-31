import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
	@Input() public src: string;
	@Input() public alt: string;
	@Input() public fit = 'cover';
	@Input() public size = 'small';
	@Input() public rounded = true;

	constructor() {}

	ngOnInit() {}
}
