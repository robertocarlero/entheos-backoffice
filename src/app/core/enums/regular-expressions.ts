export enum RegularExpressions {
	/** Only letters spaces, and ñ */
	ALPHABETIC_SPANISH = '[A-Za-z ñ Ñ ÁÉÍÓÚÑáéíóúäëïöüñ]+',

	/* Only letters ñ numbers and spaces */
	ALPHA_NUMERIC = '^[a-zA-Z0-9\\-_&./ ]{0,250}$',

	/* Only letters numbers and punctuation marks */
	ALPHA_NUMERIC_AND_PUNTUACTION = '^[a-zA-Z0-9\\d\\-_\\s{}"();:,\\[\\]ÁÉÍÓÚÑáéíóúäëïöüñ.]+$',

	/** Only numbers of 0-9 */
	NUMBER = '^-?[0-9]+$',

	/** Only letters numbers before @ and after @ letters . letters */
	EMAIL = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',

	// min 1 Mayuscula - min 1 minuscula - min 1 numero
	PASSWORD = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\\d$@$!%*?&#=+].{6,}',

	// 1 letter  - hyphen - min 6 numbers & max 9 numbers
	DNI = '^[vVeEjJ]{1,1}-[0-9]{6,9}',

	// min 1 Mayuscula - min 1 minuscula - min 1 numero - min 1 caracteres especial
	// PASSWORD = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#=+])[A-Za-z\\d$@$!%*?&#=+].{8,}',
}
