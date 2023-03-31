import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'customId',
})
export class CustomIdPipe implements PipeTransform {
	transform(value: string): string {
		if (typeof value !== 'string') return '';
		const parts = value.split('_');
		return parts[0] || value;
	}
}
