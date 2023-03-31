export class ObjectUtil {
	public clean(data: any) {
		const response: any = {};
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				let value: any = data[key];
				value = typeof value === 'string' ? value.trim() : value;
				if (value === undefined) continue;
				response[key] = value;
			}
		}
		return response;
	}
}
