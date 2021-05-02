import { CommentStatus } from './lookup-values';
import { CommentRaw } from './comment-raw';
import { Comment } from './comment';
import { DateHelper } from '../helpers/date-helper';

export class CommentFactory {
  static fromRaw(commentRaw: CommentRaw): Comment {
    return {
      ...commentRaw,
      createdTS: new Date(commentRaw.createdTS),
      modifiedTS: DateHelper.fromString(commentRaw.modifiedTS),
      statusTS: new Date(commentRaw.statusTS),
      replies: this.CommentsFromRaw(commentRaw.replies)
    }
  }

  static CommentsFromRaw(replies: CommentRaw[]): Comment[] | undefined {
    if (replies)
    {
      return replies.map(commentRaw => {
        return {
          ...commentRaw,
          createdTS: new Date(commentRaw.createdTS),
          modifiedTS: DateHelper.fromString(commentRaw.modifiedTS),
          statusTS: new Date(commentRaw.statusTS),
          replies: undefined // nur 1 level
        }
      });
    } else {
      return undefined
    }
  }

  static empty(): Comment {
    return {
      id: '',
      profileId: '',
      profileType: '',
      createdTS: new Date(),
      createdID: '',
      createdName: '',
      upVotes: 0,
      downVotes: 0,
      userVote: 0,
      rating: 0,
      ratingSort: 0,
      statusCode: CommentStatus.Pending,
      statusTS: new Date(),
      statusID: '',
      statusName: '',
      pinned: false,
      comment: ''
    }
  }
}
