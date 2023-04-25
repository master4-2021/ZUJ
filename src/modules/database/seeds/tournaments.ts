import { TournamentEntity } from '../../entities/tournament/tournament.entity';
import { TournamentService } from '../../entities/tournament/tournament.service';
import { Region } from '../../entities/tournament/tournament.types';

const tournamentData: Partial<TournamentEntity>[] = [
  {
    name: 'Premier League',
    shortName: 'PL',
    code: 'pl_en',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/65/Premier_League_Logo.svg',
  },
  {
    name: 'La Liga',
    shortName: 'LL',
    code: 'll_es',
    region: Region.ES,
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9a/La_Liga_Santander_Logo.svg',
  },
  {
    name: 'Serie A',
    shortName: 'SA',
    code: 'sa_it',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Serie_A_logo.svg',
  },
  {
    name: 'Bundesliga',
    shortName: 'BL',
    code: 'bl_de',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Bundesliga_logo_%282017%29.svg',
  },
  {
    name: 'Ligue 1',
    shortName: 'L1',
    code: 'l1_fr',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Ligue_1_Logo.svg',
  },
  {
    name: 'Champions League',
    shortName: 'CL',
    code: 'cl_eu',
    region: Region.EU,
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/67/UEFA_Champions_League_logo.svg',
  },
  {
    name: 'Europa League',
    shortName: 'EL',
    code: 'el_eu',
    region: Region.EU,
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Europa_League_logo_2010.svg',
  },
];

async function createTournaments(tournamentService: TournamentService) {
  return await tournamentService.saveMany(tournamentData);
}

export default createTournaments;
