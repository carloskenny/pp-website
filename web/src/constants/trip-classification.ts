import type {
  TripAttractionType,
  TripDifficulty,
  TripExperienceType,
} from '@/types/trip';

export const tripExperienceTypeOptions: Array<{
  value: TripExperienceType;
  label: string;
}> = [
  { value: 'trail', label: 'Trilha' },
  { value: 'tour', label: 'Passeio' },
  { value: 'camping', label: 'Camping' },
  { value: 'expedition', label: 'Expedição' },
];

export const tripAttractionTypeOptions: Array<{
  value: TripAttractionType;
  label: string;
}> = [
  { value: 'mountain', label: 'Montanha' },
  { value: 'trail', label: 'Trilha' },
  { value: 'viewpoint', label: 'Mirante' },
  { value: 'waterfall', label: 'Cachoeira' },
  { value: 'canyon', label: 'Cânion' },
  { value: 'river_aquatrekking', label: 'Rio / Aquatrekking' },
  { value: 'beach', label: 'Praia' },
  { value: 'rappel', label: 'Rapel' },
  { value: 'bungee_jump', label: 'Bungee Jump' },
  { value: 'cave', label: 'Caverna' },
  { value: 'sunrise', label: 'Nascer do Sol' },
  { value: 'sunset', label: 'Pôr do Sol' },
];

export const tripDifficultyOptions: Array<{
  value: TripDifficulty;
  label: string;
}> = [
  { value: 'easy', label: 'Leve' },
  { value: 'moderate', label: 'Moderada' },
  { value: 'hard', label: 'Difícil' },
  { value: 'very_hard', label: 'Muito difícil' },
];

export const tripExperienceTypeLabels = Object.fromEntries(
  tripExperienceTypeOptions.map((option) => [option.value, option.label]),
) as Record<TripExperienceType, string>;

export const tripAttractionTypeLabels = Object.fromEntries(
  tripAttractionTypeOptions.map((option) => [option.value, option.label]),
) as Record<TripAttractionType, string>;

export const tripDifficultyLabels = Object.fromEntries(
  tripDifficultyOptions.map((option) => [option.value, option.label]),
) as Record<TripDifficulty, string>;
