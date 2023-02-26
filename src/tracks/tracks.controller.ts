import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Request, Response } from 'express';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Post('queue')
  findOne(@Body() track) {
    return this.tracksService.addTrackToQueue(track.name);
  }

  @Get('/next/:idx')
  findNext(@Param('idx') idx: string) {
    return this.tracksService.findNext(+idx);
  }

  @Get('stream/:trackId')
  streamTrack(
    @Req() req: Request,
    @Res() res: Response,
    @Param('trackId') key: string,
  ) {
    return this.tracksService.streamTrack(key, req, res);
  }
}
