export interface Tierlist {
	id: number;
	name: string;
	user_id: string;
	created_at: string;
	background_image: string | null;
	description?: string;
	criterias: Criteria[];
	items: Item[];
	tiers: Tier[];
}

export interface Criteria {
	id: number;
	name: string;
	max_score: number;
	order: number;
}

export interface Item {
	id: number;
	image_url: string;
	tierlist_id: number;
	tiered: boolean;
	scores: Score[];
}

export interface Score {
	id: number;
	criteria_id: number;
	item_id: number;
	score: number;
}

export interface Tier {
	id: number;
	name: string;
	min_score: number;
	background_color: string;
}

export interface User {
	id: string;
	email: string;
}
