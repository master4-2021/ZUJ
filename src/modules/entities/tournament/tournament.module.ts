import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity])],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
