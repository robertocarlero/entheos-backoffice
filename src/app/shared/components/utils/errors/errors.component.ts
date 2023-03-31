import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { RegularExpressions } from 'src/app/core/enums/regular-expressions';

@Component({
	selector: 'app-errors',
	templateUrl: './errors.component.html',
	styleUrls: ['./errors.component.scss'],
})
export class ErrorsComponent {
	@Input() errors: ValidationErrors;
	@Input() prefix = 'This field is required';

	public patterns = {
		password: RegularExpressions.PASSWORD,
		number: RegularExpressions.NUMBER,
		email: RegularExpressions.EMAIL,
		dni: RegularExpressions.DNI,
		alphanumeric: RegularExpressions.ALPHA_NUMERIC,
		alfanumeric_with_puntuaction:
			RegularExpressions.ALPHA_NUMERIC_AND_PUNTUACTION,
		alphabetic: RegularExpressions.ALPHABETIC_SPANISH,
	};

	constructor() {}

	public compareRegex(formError: string, regex: string) {
		if (!formError) return;
		return formError.includes(regex);
	}
}
