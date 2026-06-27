export type TripStatus =
  | 'draft'
  | 'active'
  | 'sold_out'
  | 'finished'
  | 'inactive'
  | 'canceled';

export type ReservationStatus = 'pending' | 'payment_pending' | 'confirmed' | 'canceled';

export type TripDifficulty = 'easy' | 'moderate' | 'hard';

export type BoardingPoint = {
  id: string;
  label: string;
  order?: number;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  type?: string;
  destination: string;
  dateLabel: string;
  eventDate?: string | null;
  departureTime?: string | null;
  status: TripStatus;
  difficulty?: TripDifficulty | string | null;
  duration?: string | null;
  price?: number | null;
  capacity?: number | null;
  availableSpots?: number | null;
  summary?: string | null;
  description?: string | null;
  itinerary?: string[] | null;
  includedItems?: string[] | null;
  mainImageUrl?: string | null;
  includes?: string[];
  paymentLink?: string | null;
  whatsappLink?: string | null;
  boardingPoints?: BoardingPoint[];
};
