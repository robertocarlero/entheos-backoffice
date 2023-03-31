import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'replace',
})
export class ReplacePipe implements PipeTransform {
	transform(value: string, pattern: string, char: string = ''): string {
		if (typeof value !== 'string') return '';

		const regex = new RegExp(pattern, 'g');
		return value.replace(regex, char);
	}
}
