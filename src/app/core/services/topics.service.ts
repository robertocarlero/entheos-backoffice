import { UserService } from 'src/app/core/services/user.service';
import { Member } from 'src/app/core/interfaces/member';
import { Subject } from 'rxjs';
import { AppService } from './app.service';
import { Topic } from './../interfaces/topic';
import { DBCrud } from 'src/app/core/classes/db-crud';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TopicsService extends DBCrud {
	private DATA: Topic[] = [];
	protected PATH = this.app.PATH_TOPICS;

	constructor(private app: AppService, private user: UserService) {
		super();
	}

	public get all(): Topic[] {
		return this.DATA;
	}

	private get userTopics() {
		return this.user?.profile?.topics || [];
	}

	public subscribeToTopic(topic: Topic['name']) {
		const topics = this.userTopics.slice();

		if (topics.includes(topic)) return;

		topics.push(topic);
		this.user.updateData({ topics });
	}

	public unsubscribeFromTopic(topic: Topic['name']) {
		const topics = this.userTopics.slice();

		if (!topics.includes(topic)) return;
		const index = topics.indexOf(topic);
		topics.splice(index, 1);
		this.user.updateData({ topics });
	}

	protected initialize() {
		this.db.collection(this.PATH).onSnapshot((res) => {
			const data: any = res.docs.map((doc) => this.transformDoc(doc));
			this.DATA = data;
		});
	}
}
