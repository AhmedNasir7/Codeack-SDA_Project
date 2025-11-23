import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ChallengeModule } from './challenge/challenge.module';
import { TeamModule } from './team/team.module';
import { TournamentModule } from './tournament/tournament.module';
import { SubmissionModule } from './submission/submission.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { CodingBattleModule } from './coding-battle/coding-battle.module';
import { BugFixingChallengeModule } from './bug-fixing-challenge/bug-fixing-challenge.module';
import { FrontendChallengeModule } from './frontend-challenge/frontend-challenge.module';
import { UserSubmissionsModule } from './user-submissions/user-submissions.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { TournamentParticipantsModule } from './tournament-participants/tournament-participants.module';
import { TournamentChallengesModule } from './tournament-challenges/tournament-challenges.module';
import { LeaderboardEntriesModule } from './leaderboard-entries/leaderboard-entries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    UsersModule,
    AuthenticationModule,
    PortfolioModule,
    ChallengeModule,
    TeamModule,
    TournamentModule,
    SubmissionModule,
    LeaderboardModule,
    CodingBattleModule,
    BugFixingChallengeModule,
    FrontendChallengeModule,
    UserSubmissionsModule,
    TeamMembersModule,
    TournamentParticipantsModule,
    TournamentChallengesModule,
    LeaderboardEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
