import { Module } from '@nestjs/common';
import { TracksModule } from './tracks/tracks.module';
import { TracksQueueModule } from './tracks-queue/tracks-queue.module';

@Module({
  imports: [TracksModule, TracksQueueModule],
})
export class AppModule {}
