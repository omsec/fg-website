import { BusinessDomain, StringToBusinessDomain } from '../shared/business-domain';
import { Vote } from './voting';
import { VoteRaw } from './voting-raw';

export class VotingFactory {
  static fromRaw(voteRaw: VoteRaw): Vote {
    let str = StringToBusinessDomain(voteRaw.profileType)
    if (!str) {
      throw new Error('Invalid Object Type')
    }
    return {
      ...voteRaw,
      profileType: str,
      voteTS: new Date(voteRaw.voteTS) // vom endpoint (raw) immer gesendet
    }
  }
}
