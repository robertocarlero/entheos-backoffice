import { TopicsService } from './../../../../core/services/topics.service';
import { UserService } from 'src/app/core/services/user.service';
import { Topic } from './../../../../core/interfaces/topic';
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-topic-item',
	templateUrl: './topic-item.component.html',
	styleUrls: ['./topic-item.component.scss'],
})
export class TopicItemComponent implements OnInit {
	@Input() public data: Topic;

	constructor(private user: UserService, private topics: TopicsService) {}

	public get isActive(): boolean {
		const topics = this.user?.profile?.topics || [];
		return topics.includes(this.data.name);
	}

	ngOnInit() {}

	public onToggleClick($event: Event) {
		$event.stopImmediatePropagation();
		this.toggleSubscriptionStatus();
	}

	private toggleSubscriptionStatus() {
		if (this.isActive) {
			this.topics.unsubscribeFromTopic(this.data.name);
		} else {
			this.topics.subscribeToTopic(this.data.name);
		}
	}
}
