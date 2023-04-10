import { ClubEntity } from '../../entities/club/club.entity';
import { ClubService } from '../../entities/club/club.service';
import { TournamentEntity } from '../../entities/tournament/tournament.entity';
import { TournamentService } from '../../entities/tournament/tournament.service';
import { promiseWhile } from '../../../utils/promiseWhile';
import { Region } from '../../../common/types';

const PLClubs: Partial<ClubEntity>[] = [
  {
    name: 'Arsenal',
    shortName: 'ARS',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
  {
    name: 'Manchester City',
    shortName: 'MCI',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  {
    name: 'Manchester United',
    shortName: 'MUN',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  },
  {
    name: 'Chelsea',
    shortName: 'CHE',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  },
  {
    name: 'Liverpool',
    shortName: 'LIV',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  },
  {
    name: 'Tottenham Hotspur',
    shortName: 'TOT',
    region: Region.EN,
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  },
];

const LLClubs: Partial<ClubEntity>[] = [
  {
    name: 'Real Madrid',
    shortName: 'RMA',
    region: Region.ES,
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Real_Madrid_CF.svg',
  },
  {
    name: 'Barcelona',
    shortName: 'BAR',
    region: Region.ES,

    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/FC_Barcelona.svg',
  },
  {
    name: 'Atletico Madrid',
    shortName: 'ATM',
    region: Region.ES,

    logo: 'https://upload.wikimedia.org/wikipedia/en/9/98/Atletico_Madrid_2017_logo.svg',
  },
  {
    name: 'Sevilla',
    shortName: 'SEV',
    region: Region.ES,

    logo: 'https://upload.wikimedia.org/wikipedia/en/4/41/Sevilla_FC.svg',
  },
  {
    name: 'Valencia',
    shortName: 'VAL',
    region: Region.ES,

    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Valencia_CF.svg',
  },
  {
    name: 'Athletic Bilbao',
    shortName: 'ATH',
    region: Region.ES,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Athletic_Bilbao_logo.svg',
  },
];

const SAClubs: Partial<ClubEntity>[] = [
  {
    name: 'Juventus',
    shortName: 'JUV',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Juventus_FC.svg',
  },
  {
    name: 'Inter Milan',
    shortName: 'INT',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Inter_Milan.svg',
  },
  {
    name: 'AC Milan',
    shortName: 'ACM',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/02/AC_Milan_Logo.svg',
  },
  {
    name: 'Napoli',
    shortName: 'NAP',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/SSC_Napoli_2017.svg',
  },
  {
    name: 'AS Roma',
    shortName: 'ROM',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f0/AS_Roma_Logo.svg',
  },
  {
    name: 'Lazio',
    shortName: 'LAZ',
    region: Region.IT,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Lazio_Rome.svg',
  },
];

const BLClubs: Partial<ClubEntity>[] = [
  {
    name: 'Bayern Munich',
    shortName: 'BAY',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/FC_Bayern_Munich_logo.svg',
  },
  {
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Borussia_Dortmund_logo.svg',
  },
  {
    name: 'Bayer Leverkusen',
    shortName: 'BAY',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/FC_Bayern_Munich_logo.svg',
  },
  {
    name: 'RB Leipzig',
    shortName: 'RBL',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Borussia_Dortmund_logo.svg',
  },
  {
    name: 'Borussia Monchengladbach',
    shortName: 'BMG',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/FC_Bayern_Munich_logo.svg',
  },
  {
    name: 'Schalke 04',
    shortName: 'S04',
    region: Region.DE,
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Borussia_Dortmund_logo.svg',
  },
];

const L1Clubs: Partial<ClubEntity>[] = [
  {
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/Paris_Saint-Germain_F.C..svg',
  },
  {
    name: 'Lyon',
    shortName: 'LYO',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Olympique_Lyonnais.svg',
  },
  {
    name: 'Lille',
    shortName: 'LIL',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Olympique_Lyonnais.svg',
  },
  {
    name: 'Marseille',
    shortName: 'MAR',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Olympique_Lyonnais.svg',
  },
  {
    name: 'Monaco',
    shortName: 'MON',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Olympique_Lyonnais.svg',
  },
  {
    name: 'Rennes',
    shortName: 'REN',
    region: Region.FR,
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Olympique_Lyonnais.svg',
  },
];

const clClubs = [
  ...PLClubs.slice(0, 3),
  ...SAClubs.slice(0, 3),
  ...BLClubs.slice(0, 3),
  ...L1Clubs.slice(0, 3),
];
const elClubs = [
  ...PLClubs.slice(3),
  ...SAClubs.slice(3),
  ...BLClubs.slice(3),
  ...L1Clubs.slice(3),
];

function addTournamentToClubs(
  clubs: Partial<ClubEntity>[],
  tournament: TournamentEntity,
): void {
  return clubs.forEach((club) => {
    Object.assign(club, {
      tournaments: [...(club.tournaments || []), tournament],
    });
  });
}

async function createClubs(
  clubService: ClubService,
  tournamentService: TournamentService,
) {
  await clubService.deleteMany({ where: {} });

  const tournaments = await tournamentService.findAll();
  if (tournaments.length === 0) {
    throw new Error('Tournaments not found');
  }

  await promiseWhile(
    (index) => index < tournaments.length,
    async (index) => {
      const tournament = tournaments[index];
      switch (tournament.code) {
        case 'pl_en':
          addTournamentToClubs(PLClubs, tournament);
          break;
        case 'll_es':
          addTournamentToClubs(LLClubs, tournament);
          break;
        case 'bl_de':
          addTournamentToClubs(BLClubs, tournament);
          break;
        case 'l1_fr':
          addTournamentToClubs(L1Clubs, tournament);
          break;
        case 'sa_it':
          addTournamentToClubs(SAClubs, tournament);
          break;
        case 'cl_eu':
          addTournamentToClubs(clClubs, tournament);
          break;
        case 'el_eu':
          addTournamentToClubs(elClubs, tournament);
          break;
      }
      return index + 1;
    },
    0,
  );

  return await clubService.saveMany([
    ...PLClubs,
    ...SAClubs,
    ...BLClubs,
    ...L1Clubs,
  ]);
}

export default createClubs;
