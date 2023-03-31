import { DBDoc } from './db-doc';

export interface File extends DBDoc {
	url: string;
	name: string;
	path: string;
	contentType: string;
}
