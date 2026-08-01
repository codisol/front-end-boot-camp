export interface Movie {
  id: string;
  title: string;
  banner: string;
  description: string;
  duration: string;
  genres: string[];
  rating: number;
  releaseYear: number;
  director: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  movieIds: string[];
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    title: 'Inception',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    duration: '2h 28m',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 8.8,
    releaseYear: 2010,
    director: 'Christopher Nolan',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'movie-2',
    title: 'Interstellar',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    duration: '2h 49m',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    rating: 8.7,
    releaseYear: 2014,
    director: 'Christopher Nolan',
    createdAt: new Date('2026-01-02').toISOString(),
  },
  {
    id: 'movie-3',
    title: 'The Dark Knight',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    duration: '2h 32m',
    genres: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    releaseYear: 2008,
    director: 'Christopher Nolan',
    createdAt: new Date('2026-01-03').toISOString(),
  },
  {
    id: 'movie-4',
    title: 'Dune: Part Two',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    duration: '2h 46m',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 8.6,
    releaseYear: 2024,
    director: 'Denis Villeneuve',
    createdAt: new Date('2026-01-04').toISOString(),
  },
  {
    id: 'movie-5',
    title: 'Spirited Away',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    duration: '2h 05m',
    genres: ['Animation', 'Adventure', 'Family'],
    rating: 8.6,
    releaseYear: 2001,
    director: 'Hayao Miyazaki',
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'movie-6',
    title: 'Pulp Fiction',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    duration: '2h 34m',
    genres: ['Crime', 'Drama'],
    rating: 8.9,
    releaseYear: 1994,
    director: 'Quentin Tarantino',
    createdAt: new Date('2026-01-06').toISOString(),
  },
  {
    id: 'movie-7',
    title: 'The Matrix',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    duration: '2h 16m',
    genres: ['Action', 'Sci-Fi'],
    rating: 8.7,
    releaseYear: 1999,
    director: 'Lana & Lilly Wachowski',
    createdAt: new Date('2026-01-07').toISOString(),
  },
  {
    id: 'movie-8',
    title: 'Oppenheimer',
    banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    duration: '3h 00m',
    genres: ['Biography', 'Drama', 'History'],
    rating: 8.9,
    releaseYear: 2023,
    director: 'Christopher Nolan',
    createdAt: new Date('2026-01-08').toISOString(),
  },
  {
    id: 'movie-9',
    title: 'Parasite',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    duration: '2h 12m',
    genres: ['Drama', 'Thriller'],
    rating: 8.5,
    releaseYear: 2019,
    director: 'Bong Joon Ho',
    createdAt: new Date('2026-01-09').toISOString(),
  },
  {
    id: 'movie-10',
    title: 'Spider-Man: Into the Spider-Verse',
    banner: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1000&auto=format&fit=crop',
    description: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    duration: '1h 57m',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: 8.4,
    releaseYear: 2018,
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    createdAt: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'movie-11',
    title: 'Gladiator II',
    banner: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?q=80&w=1000&auto=format&fit=crop',
    description: 'After his home is conquered by the tyrannical emperors who now lead Rome, Lucius must enter the Colosseum to return glory to the people of Rome.',
    duration: '2h 28m',
    genres: ['Action', 'Adventure', 'Drama'],
    rating: 7.8,
    releaseYear: 2024,
    director: 'Ridley Scott',
    createdAt: new Date('2026-01-11').toISOString(),
  },
  {
    id: 'movie-12',
    title: 'Whiplash',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop',
    description: 'A promising young drummer enlists at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    duration: '1h 47m',
    genres: ['Drama', 'Music'],
    rating: 8.5,
    releaseYear: 2014,
    director: 'Damien Chazelle',
    createdAt: new Date('2026-01-12').toISOString(),
  }
];

export const DEFAULT_ADMIN: UserAccount = {
  id: 'admin-account-1',
  email: 'admin@movieapp.com',
  username: 'admin',
  role: 'admin',
  createdAt: new Date('2026-01-01').toISOString(),
};

export const DEFAULT_USER: UserAccount = {
  id: 'user-account-1',
  email: 'john@example.com',
  username: 'john_doe',
  role: 'user',
  createdAt: new Date('2026-01-01').toISOString(),
};

export const DEFAULT_COLLECTION_COVER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop';
