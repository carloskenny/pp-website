import type { Trip } from '@/types/trip';

export const trips: Trip[] = [
  {
    id: 'trip-1',
    slug: 'pico-agudo-sapopema',
    title: 'Pico Agudo',
    type: 'Nascer do sol',
    destination: 'Sapopema/PR',
    dateLabel: '03 de Maio',
    status: 'active',
    difficulty: 'hard',
    duration: '1 dia',
    price: 289,
    capacity: 40,
    summary:
      'Subida noturna, frio de montanha e nascer do sol no cume com café coletivo no topo.',
    includes: ['Transporte', 'Guias experientes', 'Seguro viagem'],
  },
  {
    id: 'trip-2',
    slug: 'lagoa-azul-aquatrekking',
    title: 'Lagoa Azul + Aquatrekking',
    destination: 'PR',
    dateLabel: '26 de Abril',
    status: 'active',
    difficulty: 'moderate',
    duration: '1 dia',
    price: 259,
    capacity: 35,
    summary:
      'Lagoa Azul, Cachoeira das Andorinhas e aquatrekking dentro do rio, entre pedras e água.',
    includes: ['Transporte', 'Guias experientes', 'Seguro viagem'],
  },
  {
    id: 'trip-3',
    slug: 'mirante-das-piramides-grao-para',
    title: 'Pirâmides Sagradas',
    destination: 'Grão-Pará/SC',
    dateLabel: '30 e 31 de Maio',
    status: 'active',
    difficulty: 'moderate',
    duration: '2 dias',
    price: 499,
    capacity: 30,
    summary:
      'Trilha, lanche no topo, pôr do sol no lago, churrasco, cachoeira e descanso.',
    includes: ['Transporte', 'Guias experientes', 'Seguro viagem'],
  },
];
