import { Criteria, Item } from './definitions';

export function calculateItemScore(item: Item, criterias: Criteria[]): number {
	if (!item.ratings.length) return 0;

	const totalMaxRate = criterias
		.filter((criteria) => criteria.name.toLowerCase() !== 'bonus')
		.reduce((acc, criteria) => acc + criteria.maxRate, 0);
	const normalizationFactor = 20 / totalMaxRate;

	const nonBonusRatings = item.ratings.filter(
		(rating) => rating.criteriaName.toLowerCase() !== 'bonus'
	);
	const totalNonBonusScore =
		nonBonusRatings.reduce((total, rating) => total + rating.rate, 0) * normalizationFactor;

	const bonusRating =
		item.ratings.find((rating) => rating.criteriaName.toLowerCase() === 'bonus')?.rate || 0;

	const score = totalNonBonusScore + bonusRating;
	return Math.min(Math.max(score, 0), 20);
}
