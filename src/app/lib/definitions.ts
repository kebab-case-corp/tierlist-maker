export interface Tierlist {
    id?: string;
    userId: string;
    backgroundImg?: string;
    name: string;
    createdAt: number;
    description?: string;
    criterias: Criteria[];
    tiers: Tier[];
}

export interface Criteria {
    name: string;
    maxRate: number;
    description?: string;
}

export interface Tier {
    name: string;
    max: number;
}

export interface Item {
    id?: string;
    imageUrl: string;
    ratings: Rating[];
    tiered: boolean;
}

export interface Rating {
    criteriaName: string;
    rate: number;
}
