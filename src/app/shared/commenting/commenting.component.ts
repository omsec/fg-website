import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentFactory } from 'src/app/models/comment-factory';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { Comment } from '../../models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { BusinessDomain } from '../business-domain';

@Component({
  selector: 'fg-commenting',
  templateUrl: './commenting.component.html',
  styleUrls: ['./commenting.component.css']
})
export class CommentingComponent implements OnInit {
  @Input() profileId = '';
  @Input() profileType = BusinessDomain.course;

  comments$: Observable<Comment[]> | undefined;
  errorMsg = '';
  // canModifiy = false; // creators/admin - ToDO: noch überlegen
  readOnly = true;

  // Status/Modus-Flag für Template
  // (wenn das gedrückt wurde, wird der editor für die ID angezeigt)
  reply = false;
  replyId = '';

  constructor(
    private commentService: CommentService,
    private authenticationService: AuthenticationService
  ) {
    this.readOnly = (this.authenticationService.currentUserValue.id == '')
  }

  ngOnInit(): void {
    this.comments$ = this.commentService.getAll(this.profileId);
    // ToDO: https://github.com/omsec/fg-website/blob/master/src/app/racing/course-show2/course-show2.component.ts
  }

  toggleEditor(commentId: string) {
    // wird beim gleichen/aktuellen Kommentar geklickt, wird der Editor ein/ausgeblendet
    // wird bei einem anderen Kommentar geklickt, wird der Editor immer eingeblendet
    if (commentId === this.replyId) { this.reply = (!this.reply); } else {
      this.reply = true;
    }

    this.replyId = commentId;
  }

  onCommentAdded(id: string): void {
    // reload component
   this.ngOnInit();
  }


}
