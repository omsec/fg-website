import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'fg-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent {
  @Input() profileId = '';
  @Input() profileType = '' //BusinessDomain.course;

  // if set to true, profileId is considered a commentId
  @Input() isReply = false;

  // Event für die Steuerkomponente
  @Output() commentAdded = new EventEmitter();

  errorMsg = '';

  constructor(private commentSerivce: CommentService) { }

  createComment(comment: Comment): void {

    if (this.isReply == true) {
      comment.id = this.profileId
    }
    comment.profileId = this.profileId
    comment.profileType = this.profileType;
    this.commentSerivce.add(comment).subscribe(
      (res) => {
        // emit event to reload parent
        this.commentAdded.emit(res.id);
      },
      errMsg => {
        this.errorMsg = errMsg
      }
    );
  }

}
