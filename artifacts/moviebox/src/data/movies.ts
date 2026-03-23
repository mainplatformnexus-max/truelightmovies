export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  poster: string;
  backdrop: string;
  description: string;
  type: "movie" | "series";
  episodes?: number;
  seasons?: number;
}

const TMDB_IMG = "https://image.tmdb.org/t/p/";

export const featuredMovies: Movie[] = [
  {
    id: 1,
    title: "Deadpool & Wolverine",
    year: 2024,
    rating: 7.8,
    genre: ["Action", "Comedy", "Superhero"],
    poster: `${TMDB_IMG}w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg`,
    backdrop: `${TMDB_IMG}original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg`,
    description: "A listless Wade Wilson toils away in civilian life. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    type: "movie"
  },
  {
    id: 2,
    title: "Inside Out 2",
    year: 2024,
    rating: 7.9,
    genre: ["Animation", "Family", "Comedy"],
    poster: `${TMDB_IMG}w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg`,
    backdrop: `${TMDB_IMG}original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg`,
    description: "Teenager Riley's mind headquarters is suddenly taken over by a new and very unexpected emotion: Anxiety.",
    type: "movie"
  },
  {
    id: 3,
    title: "Alien: Romulus",
    year: 2024,
    rating: 7.3,
    genre: ["Science Fiction", "Horror", "Thriller"],
    poster: `${TMDB_IMG}w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg`,
    backdrop: `${TMDB_IMG}original/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg`,
    description: "A group of young colonizers come face to face with the most terrifying life form in the universe while scavenging the depths of a derelict space station.",
    type: "movie"
  },
  {
    id: 4,
    title: "Gladiator II",
    year: 2024,
    rating: 7.1,
    genre: ["Action", "Adventure", "Drama"],
    poster: `${TMDB_IMG}w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg`,
    backdrop: `${TMDB_IMG}original/euYIwmwkmz95mnXvufEJLTTSNJW.jpg`,
    description: "Years after witnessing the death of the revered hero Maximus at the hands of the corrupt Emperor Commodus, Lucius is forced to enter the Colosseum.",
    type: "movie"
  },
  {
    id: 5,
    title: "Moana 2",
    year: 2024,
    rating: 7.0,
    genre: ["Animation", "Adventure", "Family"],
    poster: `${TMDB_IMG}w500/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg`,
    backdrop: `${TMDB_IMG}original/g7x5SbIwzNFoBlD5VERWfRfbGYd.jpg`,
    description: "Moana embarks on an ambitious sea voyage beyond the far seas of Motunui.",
    type: "movie"
  }
];

export const popularSeries: Movie[] = [
  {
    id: 101,
    title: "The Bear",
    year: 2022,
    rating: 8.7,
    genre: ["Drama", "Comedy"],
    poster: `${TMDB_IMG}w500/sHm9TbHoUhm4KgRDMQyWbTBG0Pg.jpg`,
    backdrop: `${TMDB_IMG}original/q3FkuovRcuFEiPDUKQNRVrmefW0.jpg`,
    description: "A young chef from the fine dining world comes to run his family's sandwich shop in Chicago.",
    type: "series",
    seasons: 3
  },
  {
    id: 102,
    title: "House of the Dragon",
    year: 2022,
    rating: 8.5,
    genre: ["Drama", "Fantasy", "Action"],
    poster: `${TMDB_IMG}w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg`,
    backdrop: `${TMDB_IMG}original/uMZgHkMfXEZAtZlZ6QqFhEONBNc.jpg`,
    description: "An internal succession war within House Targaryen at the height of its power, 200 years before the events of Game of Thrones.",
    type: "series",
    seasons: 2
  },
  {
    id: 103,
    title: "The Last of Us",
    year: 2023,
    rating: 8.8,
    genre: ["Drama", "Action", "Sci-Fi"],
    poster: `${TMDB_IMG}w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg`,
    backdrop: `${TMDB_IMG}original/uDgy6hyPd82kOHh6I95kkZaEKc9.jpg`,
    description: "After a global catastrophe, Joel Miller must escort a young girl who may be key to curing the infection that destroyed civilization.",
    type: "series",
    seasons: 2
  },
  {
    id: 104,
    title: "Shogun",
    year: 2024,
    rating: 8.9,
    genre: ["Drama", "Action", "History"],
    poster: `${TMDB_IMG}w500/7O4iVfOMQmdCSxhOg0OTe0kSAI7.jpg`,
    backdrop: `${TMDB_IMG}original/h5oWS8VJ9cLBpQCSA4MZoXi6CgY.jpg`,
    description: "In feudal Japan, a mysterious European sailor washes ashore and becomes embroiled in a dangerous conflict in 1600.",
    type: "series",
    seasons: 1
  },
  {
    id: 105,
    title: "Fallout",
    year: 2024,
    rating: 8.6,
    genre: ["Action", "Sci-Fi", "Drama"],
    poster: `${TMDB_IMG}w500/AnsSKS5K7aR2EvxMPjyvMjQqCz7.jpg`,
    backdrop: `${TMDB_IMG}original/jLb3CQMV9OoGCRrMtaS6cxMbkiW.jpg`,
    description: "200 years after nuclear apocalypse, a sheltered woman emerges to find a dangerous, weird, and unexpected world outside.",
    type: "series",
    seasons: 1
  },
  {
    id: 106,
    title: "Slow Horses",
    year: 2022,
    rating: 8.2,
    genre: ["Thriller", "Drama", "Espionage"],
    poster: `${TMDB_IMG}w500/oSuCnaAEFlBzOxKfFCOhfT5o5s1.jpg`,
    backdrop: `${TMDB_IMG}original/q8eejQcg1bAqImEV8jh2RtPLezb.jpg`,
    description: "A dysfunctional team of MI5 agents, who have been relegated to a dumping ground department known as Slough House.",
    type: "series",
    seasons: 4
  },
  {
    id: 107,
    title: "The Diplomat",
    year: 2023,
    rating: 7.8,
    genre: ["Drama", "Politics", "Thriller"],
    poster: `${TMDB_IMG}w500/2meX1nMdScFOoV4370odb8R6KoP.jpg`,
    backdrop: `${TMDB_IMG}original/2FYGkQd3Zs5Gge0eVNZEXMDKzwn.jpg`,
    description: "An American ambassador to the United Kingdom navigates global crises while her marriage to a former diplomat complicates her work.",
    type: "series",
    seasons: 2
  },
  {
    id: 108,
    title: "Silo",
    year: 2023,
    rating: 8.1,
    genre: ["Sci-Fi", "Drama", "Mystery"],
    poster: `${TMDB_IMG}w500/3P52oz9HPQdxFnEMOl4TNfJCE3x.jpg`,
    backdrop: `${TMDB_IMG}original/v1VUKQl63DpZqHBbN0kcqHOHFMC.jpg`,
    description: "In a ruined and toxic future, thousands of people live in a giant silo underground. The rules are strict and those who break them must go outside.",
    type: "series",
    seasons: 2
  }
];

export const popularMovies: Movie[] = [
  {
    id: 201,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.5,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    poster: `${TMDB_IMG}w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg`,
    backdrop: `${TMDB_IMG}original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg`,
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    type: "movie"
  },
  {
    id: 202,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.3,
    genre: ["Drama", "History", "Thriller"],
    poster: `${TMDB_IMG}w500/8Gxv8giaFIzmZTFMrVynzRy9pZa.jpg`,
    backdrop: `${TMDB_IMG}original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg`,
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    type: "movie"
  },
  {
    id: 203,
    title: "Wicked",
    year: 2024,
    rating: 7.8,
    genre: ["Fantasy", "Musical", "Drama"],
    poster: `${TMDB_IMG}w500/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg`,
    backdrop: `${TMDB_IMG}original/uKGFl2nUoL9HmaOdcYTHRiLCFH7.jpg`,
    description: "The story of the witches of Oz, before Dorothy arrived.",
    type: "movie"
  },
  {
    id: 204,
    title: "Twisters",
    year: 2024,
    rating: 7.2,
    genre: ["Action", "Adventure", "Thriller"],
    poster: `${TMDB_IMG}w500/pjnD08FlMAIXsfOLKQbIt9CDxo7.jpg`,
    backdrop: `${TMDB_IMG}original/1FEb3gLGOvMHTiVhYTf6RBdL6Eu.jpg`,
    description: "A storm chaser and a cowboy attempt to test an experimental weather intervention device when a series of powerful tornadoes strikes.",
    type: "movie"
  },
  {
    id: 205,
    title: "Kingdom of the Planet of the Apes",
    year: 2024,
    rating: 6.8,
    genre: ["Action", "Adventure", "Sci-Fi"],
    poster: `${TMDB_IMG}w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg`,
    backdrop: `${TMDB_IMG}original/fqv8v6AycXKsivp1T5yKtLbGXce.jpg`,
    description: "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught.",
    type: "movie"
  },
  {
    id: 206,
    title: "A Quiet Place: Day One",
    year: 2024,
    rating: 6.9,
    genre: ["Horror", "Thriller", "Sci-Fi"],
    poster: `${TMDB_IMG}w500/yrpPYKijwdMHyTGIOd1iK1h0Wo6.jpg`,
    backdrop: `${TMDB_IMG}original/gJcBTY5VPLQRfHFBdZBqPIAgNIC.jpg`,
    description: "Experience the day the world went quiet, as the United States faces an alien invasion.",
    type: "movie"
  },
  {
    id: 207,
    title: "Bad Boys: Ride or Die",
    year: 2024,
    rating: 6.7,
    genre: ["Action", "Comedy", "Crime"],
    poster: `${TMDB_IMG}w500/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg`,
    backdrop: `${TMDB_IMG}original/9wqP3HbmHPcHBzFf7PWkLorYPDr.jpg`,
    description: "After their captain is implicated in a drug cartel conspiracy, two detectives go on the run.",
    type: "movie"
  },
  {
    id: 208,
    title: "Hit Man",
    year: 2024,
    rating: 7.5,
    genre: ["Comedy", "Crime", "Romance"],
    poster: `${TMDB_IMG}w500/1126gjwtubDFyGs9ml5mPNq7E5k.jpg`,
    backdrop: `${TMDB_IMG}original/iTa6J3aIL7MjxMT7R07GWWqZ3HX.jpg`,
    description: "A mild-mannered professor moonlights as a fake hit man for a local police department and falls for a woman who hired him.",
    type: "movie"
  }
];

export const actionMovies: Movie[] = [
  {
    id: 301,
    title: "Furiosa: A Mad Max Saga",
    year: 2024,
    rating: 7.8,
    genre: ["Action", "Adventure", "Sci-Fi"],
    poster: `${TMDB_IMG}w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg`,
    backdrop: `${TMDB_IMG}original/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg`,
    description: "The origin story of renegade warrior Furiosa before she teamed up with Mad Max.",
    type: "movie"
  },
  {
    id: 302,
    title: "Civil War",
    year: 2024,
    rating: 7.5,
    genre: ["Action", "Drama", "War"],
    poster: `${TMDB_IMG}w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg`,
    backdrop: `${TMDB_IMG}original/ugS5FVfCI3RV0ZwZtBV3HAV75OX.jpg`,
    description: "In the near future, a team of journalists travel across the United States during a rapidly escalating civil war.",
    type: "movie"
  },
  {
    id: 303,
    title: "The Beekeeper",
    year: 2024,
    rating: 7.0,
    genre: ["Action", "Thriller"],
    poster: `${TMDB_IMG}w500/A7EByudX0eqqArAW3RvDisGqAll.jpg`,
    backdrop: `${TMDB_IMG}original/a7DIIe0IXC0bHVRlpbbVRXZgM0T.jpg`,
    description: "One man's campaign for vengeance takes on national stakes after he is revealed to be a former operative of a powerful and clandestine organization.",
    type: "movie"
  },
  {
    id: 304,
    title: "Monkey Man",
    year: 2024,
    rating: 7.3,
    genre: ["Action", "Thriller"],
    poster: `${TMDB_IMG}w500/ekG9KJNHiJZXZGiTqO8EFGAhE8P.jpg`,
    backdrop: `${TMDB_IMG}original/sg4XNNqKOGADuAKJW7D0QMtZBLo.jpg`,
    description: "A young man seeks justice for his mother's death by taking on the corrupt officials who destroyed their village.",
    type: "movie"
  },
  {
    id: 305,
    title: "The Fall Guy",
    year: 2024,
    rating: 7.3,
    genre: ["Action", "Comedy", "Romance"],
    poster: `${TMDB_IMG}w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg`,
    backdrop: `${TMDB_IMG}original/H5HjE7wd4SbRn7bya5EXKGRA8y.jpg`,
    description: "A stuntman is reluctantly pulled back into the spy world when his ex-girlfriend becomes targeted by a rogue agency.",
    type: "movie"
  },
  {
    id: 306,
    title: "Godzilla x Kong: The New Empire",
    year: 2024,
    rating: 6.4,
    genre: ["Action", "Adventure", "Sci-Fi"],
    poster: `${TMDB_IMG}w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg`,
    backdrop: `${TMDB_IMG}original/xRd1eJIDe7JHO5KUyUmnuoKp3Vd.jpg`,
    description: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins.",
    type: "movie"
  },
  {
    id: 307,
    title: "Rebel Moon – Part Two",
    year: 2024,
    rating: 5.7,
    genre: ["Action", "Sci-Fi", "Adventure"],
    poster: `${TMDB_IMG}w500/ui4DrH1cKk2vkHshcUcGt2lKxCm.jpg`,
    backdrop: `${TMDB_IMG}original/im0TjLJDMoYfCnCG0PVzXfFCIYj.jpg`,
    description: "Kora and surviving warriors prepare to fight back against the tyrannical Regent Balisarius.",
    type: "movie"
  },
  {
    id: 308,
    title: "Kraven the Hunter",
    year: 2024,
    rating: 5.8,
    genre: ["Action", "Adventure", "Fantasy"],
    poster: `${TMDB_IMG}w500/i47IUSsN126K11JUzqQIOi1Mg1M.jpg`,
    backdrop: `${TMDB_IMG}original/m8pwf4ce2fTb7x2jGZkdPTeSWJM.jpg`,
    description: "The story of Kraven Kravinoff's complicated relationship with his ruthless gangster father, Nikolai.",
    type: "movie"
  }
];

export const horrorMovies: Movie[] = [
  {
    id: 401,
    title: "Longlegs",
    year: 2024,
    rating: 6.3,
    genre: ["Horror", "Thriller", "Mystery"],
    poster: `${TMDB_IMG}w500/qESfP3baqOJx1lKVtAnRbpRcDpJ.jpg`,
    backdrop: `${TMDB_IMG}original/3TNSoa0UHGEzEz5WZOE3pobMGDo.jpg`,
    description: "An FBI agent joins the hunt for a serial killer who leaves cryptic messages at crime scenes.",
    type: "movie"
  },
  {
    id: 402,
    title: "MaXXXine",
    year: 2024,
    rating: 6.4,
    genre: ["Horror", "Thriller"],
    poster: `${TMDB_IMG}w500/wPHRl4j2TnQbXzMTvuBp5J0g0Nc.jpg`,
    backdrop: `${TMDB_IMG}original/hSxXDjHQgLCHrKVLpgf9Kb9KNCQ.jpg`,
    description: "In 1980s Hollywood, adult film star and aspiring actress Maxine Minx finally gets her big break.",
    type: "movie"
  },
  {
    id: 403,
    title: "Imaginary",
    year: 2024,
    rating: 5.3,
    genre: ["Horror", "Thriller"],
    poster: `${TMDB_IMG}w500/vyGBRlhMWbBBIGBpvbIuNSfE0xU.jpg`,
    backdrop: `${TMDB_IMG}original/r2J02Z2OpNTctfOSN1Ydgzu38y6.jpg`,
    description: "When Jessica and her family move back into her childhood home, her stepdaughter Alice forms a concerning attachment to a stuffed bear.",
    type: "movie"
  },
  {
    id: 404,
    title: "Abigail",
    year: 2024,
    rating: 6.6,
    genre: ["Horror", "Thriller", "Comedy"],
    poster: `${TMDB_IMG}w500/of53JOdvMDWPIUQIGnZCU9SIHMY.jpg`,
    backdrop: `${TMDB_IMG}original/6zYXiIhkfRnBj6ZBDHlV0A3FPWF.jpg`,
    description: "A group of criminals kidnap the daughter of a powerful underworld figure, only to discover she's a 140-year-old vampire.",
    type: "movie"
  },
  {
    id: 405,
    title: "Tarot",
    year: 2024,
    rating: 5.5,
    genre: ["Horror", "Mystery"],
    poster: `${TMDB_IMG}w500/ryHmhRCzFnTAfTDCE7LKbJ9syNG.jpg`,
    backdrop: `${TMDB_IMG}original/1sVtY8NKJB9LXL3eSW68MaHoJoI.jpg`,
    description: "A group of friends discover an antique tarot card set that unleashes horrific forces beyond their imagination.",
    type: "movie"
  },
  {
    id: 406,
    title: "The Watchers",
    year: 2024,
    rating: 5.2,
    genre: ["Horror", "Mystery", "Thriller"],
    poster: `${TMDB_IMG}w500/5VTN0pR8gcqV3EPUHHfMGnJYspM.jpg`,
    backdrop: `${TMDB_IMG}original/o76ZDm8PS9791XiuieNB93UZcRV.jpg`,
    description: "A 28-year-old artist gets stranded in an expansive, uncharted forest in western Ireland and must follow strict rules to survive.",
    type: "movie"
  },
  {
    id: 407,
    title: "Strange Darling",
    year: 2024,
    rating: 7.2,
    genre: ["Thriller", "Crime", "Horror"],
    poster: `${TMDB_IMG}w500/bQa0dGPnWuAHolrNvDFkUxKkbkn.jpg`,
    backdrop: `${TMDB_IMG}original/fxGXcCpw3jZq5I5iqFX2jFMjqMG.jpg`,
    description: "A one-night stand turns terrifying as the Lady finds herself running from the Demon, a serial killer.",
    type: "movie"
  },
  {
    id: 408,
    title: "The Substance",
    year: 2024,
    rating: 7.4,
    genre: ["Horror", "Sci-Fi", "Drama"],
    poster: `${TMDB_IMG}w500/lqoMzCcZYEFK729d6qzt349fB4o.jpg`,
    backdrop: `${TMDB_IMG}original/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg`,
    description: "A mysterious substance promises to create a better version of you. For one celebrity, the consequences are terrifying.",
    type: "movie"
  }
];

export const adventureMovies: Movie[] = [
  {
    id: 501,
    title: "Fly Me to the Moon",
    year: 2024,
    rating: 7.1,
    genre: ["Comedy", "Drama", "Romance"],
    poster: `${TMDB_IMG}w500/f4K9VRz8MV3n8mKHiHi2bJr0YKO.jpg`,
    backdrop: `${TMDB_IMG}original/cjX5Df6lkbpGkKLBCkBmOcHnaDl.jpg`,
    description: "A NASA launch director and a marketing expert are at odds with each other as the latter is brought in to fix the public image of the Apollo 11 moon landing.",
    type: "movie"
  },
  {
    id: 502,
    title: "IF",
    year: 2024,
    rating: 6.6,
    genre: ["Animation", "Comedy", "Family"],
    poster: `${TMDB_IMG}w500/xbKFv4KF3sVYuWKllLlcplCFopi.jpg`,
    backdrop: `${TMDB_IMG}original/AzMQAMFYBFE7bm1EqOeK7nNAZGm.jpg`,
    description: "A young girl discovers she can see everyone's imaginary friends and sets out to connect them with their kids who've forgotten them.",
    type: "movie"
  },
  {
    id: 503,
    title: "The Wild Robot",
    year: 2024,
    rating: 8.4,
    genre: ["Animation", "Adventure", "Drama"],
    poster: `${TMDB_IMG}w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg`,
    backdrop: `${TMDB_IMG}original/417tYZ4XOyJOJsOrqtMmBeMl4bN.jpg`,
    description: "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island where she must learn to adapt to a harsh environment.",
    type: "movie"
  },
  {
    id: 504,
    title: "Transformers One",
    year: 2024,
    rating: 7.3,
    genre: ["Animation", "Action", "Adventure"],
    poster: `${TMDB_IMG}w500/iRCgqpdVE4wyLQvGYU3ZP7pAtUc.jpg`,
    backdrop: `${TMDB_IMG}original/faNXdNWEWpgxNWFkq0vkMB7DKFJ.jpg`,
    description: "The untold origin story of Optimus Prime and Megatron, better known as sworn enemies, but who were once friends bonded like brothers.",
    type: "movie"
  },
  {
    id: 505,
    title: "Harold and the Purple Crayon",
    year: 2024,
    rating: 5.8,
    genre: ["Comedy", "Adventure", "Family"],
    poster: `${TMDB_IMG}w500/mKvJUCBHSPAGVMDMXLDO3IfnB9B.jpg`,
    backdrop: `${TMDB_IMG}original/dFK2TiNkBdp5k4bnKdWmCNkzJpq.jpg`,
    description: "Harold, an imaginary character from a children's book, comes into the real world and must find his way home.",
    type: "movie"
  },
  {
    id: 506,
    title: "The Garfield Movie",
    year: 2024,
    rating: 6.4,
    genre: ["Animation", "Comedy", "Adventure"],
    poster: `${TMDB_IMG}w500/xYLBgw7dHyEBmgEBSZqxuOm7p3s.jpg`,
    backdrop: `${TMDB_IMG}original/rO3nHIm4Tpa4a2g7tSBnvCORUOl.jpg`,
    description: "Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure.",
    type: "movie"
  },
  {
    id: 507,
    title: "Despicable Me 4",
    year: 2024,
    rating: 6.7,
    genre: ["Animation", "Comedy", "Family"],
    poster: `${TMDB_IMG}w500/wWba3TkDmIBnGZQnGTR8F5dBqjm.jpg`,
    backdrop: `${TMDB_IMG}original/6OnoMgGFuZ921aknPOJKoMiRTG1.jpg`,
    description: "Gru and Lucy and their girls are now super-agents going after Maxime Le Mal and his girlfriend Valentina.",
    type: "movie"
  },
  {
    id: 508,
    title: "Wonka",
    year: 2023,
    rating: 7.2,
    genre: ["Fantasy", "Adventure", "Musical"],
    poster: `${TMDB_IMG}w500/qhb1qOilapbapxWQn9uh1njXS51.jpg`,
    backdrop: `${TMDB_IMG}original/oBIQDKcqNxKckjugtmzpIIOgDFy.jpg`,
    description: "With dreams of opening a shop in a city renowned for its chocolate, a young and poor Willy Wonka discovers that the city's chocolate industry is run by a cartel.",
    type: "movie"
  }
];

export const navItems = [
  { id: "home", label: "Home", icon: "🏠", activeIcon: "🏠" },
  { id: "movies", label: "Movies", icon: "🎬", activeIcon: "🎬" },
  { id: "series", label: "TV Shows", icon: "📺", activeIcon: "📺" },
  { id: "downloads", label: "Downloads", icon: "⬇️", activeIcon: "⬇️" },
];
