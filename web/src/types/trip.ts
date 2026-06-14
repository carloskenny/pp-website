export type TripStatus = 'draft' | 'active' | 'sold_out' | 'finished' | 'inactive';

export type ReservationStatus = 'pending' | 'payment_pending' | 'confirmed' | 'canceled';

export type TripDifficulty = 'easy' | 'moderate' | 'hard';

export type BoardingPoint = {
  id: string;
  label: string;
};

export type Trip = {
  id: string;
  slug: string;
  title: string;
  type?: string;
  destination: string;
  dateLabel: string;
  status: TripStatus;
  difficulty?: TripDifficulty | string | null;
  duration?: string | null;
  price?: number | null;
  capacity?: number | null;
  summary?: string | null;
  includes?: string[];
  paymentLink?: string | null;
  whatsappLink?: string | null;
};
