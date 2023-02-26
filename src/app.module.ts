import { Module } from '@nestjs/common';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [TracksModule],
})
export class AppModule {}
