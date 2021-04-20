import { Vote } from './voting';
import { VoteRaw } from './voting-raw';

export class VotingFactory {
  static fromRaw(voteRaw: VoteRaw): Vote {
    return {
      ...voteRaw,
      voteTS: new Date(voteRaw.voteTS) // vom endpoint (raw) immer gesendet
    }
  }
}
