import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { MessageService } from 'primeng/api';

import { Domain } from '../../shared/domain'
import { ProfileVotes, Vote, VoteAction } from 'src/app/models/voting';
import { VotingService } from 'src/app/services/voting.service';
import { catchError, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'fg-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
  providers: [MessageService]
})
export class VotingComponent implements OnInit {
  @Input() domain = '';
  @Input() profileId = '';

  // "const" für's Template
  VOTE_ACTION = VoteAction;

  profileVotes$: Observable<ProfileVotes> | undefined;
  errorMsg = '';

  msgShown = false;

  noData: ProfileVotes = {
    upVotes: 0,
    downVotes: 0,
    userVote: VoteAction.notVoted
  };

  constructor(
    private votingService: VotingService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    //this.profileVotes$ = this.votingService.getVotes(this.domain, this.profileId);

    this.profileVotes$ = this.votingService.getVotes(this.domain, this.profileId)
      .pipe(
        catchError(err => {
          this.errorMsg = err;
          return of(this.noData)
        })
    );
  }

  showNotLoggedInMsg() {
    if (this.msgShown == true) { return }
    this.messageService.add({severity:'info', summary:'Log-in', detail:'Become a member to vote & comment'});
    this.msgShown = true;
  }

  registerVote(voteAction: VoteAction): void {

    // show info if not logged-in
    if (this.authenticationService.currentUserValue.id == '') {
      this.showNotLoggedInMsg()
      return
    }

    // send vote & reload
    let vote: Vote = {
      profileID: this.profileId,
      userID: this.authenticationService.currentUserValue.id,
      vote: voteAction
    }

    // ToDO: obj type
    this.profileVotes$ = this.votingService.castVote(this.domain, vote)
    .pipe(
      catchError(err => {
        this.errorMsg = err;
        return of(this.noData)
      })
  );
  }

}
