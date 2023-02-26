import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ReadStream, Stats } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import { TracksStorage } from 'src/tracks/tracks-storage.service';

@Injectable()
export class TracksService implements OnModuleInit {
  constructor(private trackStorage: TracksStorage) {}

  onModuleInit() {
    this.saveTracksOnStorage();
  }

  private saveTracksOnStorage() {
    const tracksDir = path.join(
      `${process.cwd()}/audio-streaming/../public/assets/audio/tracks`,
    );

    fs.readdir(tracksDir, (_, files) => {
      files.forEach((file, i) => {
        const trackName = file.split('.')[0];
        this.trackStorage.append({ position: i, songName: trackName });
      });
    });
  }

  findAll() {
    return this.trackStorage.toArray();
  }

  async streamTrack(key: string, req: Request, res: Response) {
    const musicPath = path.join(
      `${process.cwd()}/public/assets/audio/tracks/${key}.mp3`,
    );

    let stat: Stats;

    try {
      stat = fs.statSync(musicPath);
    } catch (e) {
      throw new NotFoundException('Unable to find the song');
    }

    const range = req.headers.range;

    let readStream: ReadStream;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');

      const partialStart = parts[0];
      const partialEnd = parts[1];

      if (
        (isNaN(Number(partialStart)) && partialStart.length > 1) ||
        (isNaN(Number(partialEnd)) && partialEnd.length > 1)
      ) {
        throw new InternalServerErrorException('Something went wrong');
      }

      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1;
      const contentLength = end - start + 1;

      res.status(206).header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': contentLength,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
      });

      readStream = fs.createReadStream(musicPath, { start: start, end: end });
    } else {
      res.header({
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });
      readStream = fs.createReadStream(musicPath);
    }

    readStream.pipe(res);
  }
}
