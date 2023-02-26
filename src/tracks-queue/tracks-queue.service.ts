import { Injectable } from '@nestjs/common';
import { TracksQueueStorage } from './tracks-queue-storage.service';

@Injectable()
export class TracksQueueService {
  constructor(private readonly tracksQueueStorage: TracksQueueStorage) {}

  addTrackToQueue(payload) {
    const { name } = payload;
    const lastTrack = this.tracksQueueStorage.last?.value;

    return this.tracksQueueStorage.append({
      position: lastTrack ? lastTrack.position + 1 : 0,
      songName: name,
    }).last.value;
  }

  findAll() {
    return this.tracksQueueStorage.toArray();
  }

  findNext(idx: number) {
    return this.tracksQueueStorage.get(idx).next.value;
  }

  findPrevious(idx: number) {
    return this.tracksQueueStorage.get(idx - 1).next.value;
  }
}
