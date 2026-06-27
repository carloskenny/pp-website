export const tripExperienceTypes = ['trail', 'tour', 'camping', 'expedition'] as const;

export type TripExperienceType = (typeof tripExperienceTypes)[number];

export const tripAttractionTypes = [
  'mountain',
  'trail',
  'viewpoint',
  'waterfall',
  'canyon',
  'river_aquatrekking',
  'beach',
  'rappel',
  'bungee_jump',
  'cave',
  'sunrise',
  'sunset',
] as const;

export type TripAttractionType = (typeof tripAttractionTypes)[number];

export const tripDifficultyTypes = ['easy', 'moderate', 'hard', 'very_hard'] as const;

export type TripDifficulty = (typeof tripDifficultyTypes)[number];
