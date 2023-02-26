import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Circular } from 'src/util/circular';

@Module({
  controllers: [TracksController],
  providers: [TracksService, Circular],
})
export class TracksModule {}
