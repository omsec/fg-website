import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { MessageService } from 'primeng/api';

import { BusinessDomain } from '../business-domain'
import { ProfileVotes, Vote, VoteAction } from 'src/app/models/voting';
import { VotingService } from 'src/app/services/voting.service';
import { catchError, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'fg-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
  providers: [MessageService]
})
export class VotingComponent implements OnInit {
  @Input() domain = BusinessDomain.course;
  @Input() profileId = '';
  // number geht aus irgendeinem grund nicht - wirft im template vom parent fehler
  @Input() upVotes = '0';
  @Input() downVotes = '0';
  @Input() userVote = '0';

  // "const" für's Template
  VOTE_ACTION = VoteAction;

  profileVotes$: Observable<ProfileVotes> | undefined;
  errorMsg = '';

  msgShown = false; // used for not-logged-in msg

  // returned in case of an error
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

    if (this.authenticationService.currentUserValue.id != '') {
      let pv: ProfileVotes = {
        upVotes: +this.upVotes,
        downVotes: +this.downVotes,
        userVote: +this.userVote
      }
      this.profileVotes$ = of(pv);
    } else {
      let pv: ProfileVotes = {
        upVotes: +this.upVotes,
        downVotes: +this.downVotes,
        userVote: VoteAction.notVoted
      }
      this.profileVotes$ = of(pv);
    }

    // alte lösung mit eigenen service - neu über parent/input
    /*
    if (this.authenticationService.currentUserValue.id != '') {
      this.profileVotes$ = this.votingService.getUserVote(this.profileId)
      .pipe(
        map(uv => {
          let pv: ProfileVotes = {
            upVotes: +this.upVotes,
            downVotes: +this.downVotes,
            userVote: uv
          }
          // console.log(pv);
          return (pv);
        }),
        catchError(err => {
          this.errorMsg = err;
          return of(this.noData)
        })
      );
    } else {
      // no user logged-in
      let pv: ProfileVotes = {
        upVotes: +this.upVotes,
        downVotes: +this.downVotes,
        userVote: VoteAction.notVoted
      }
      this.profileVotes$ = of(pv);
    }
    */


    /*
    this.profileVotes$ = this.votingService.getVotes(this.domain, this.profileId)
      .pipe(
        catchError(err => {
          this.errorMsg = err;
          return of(this.noData)
        })
    );
    */
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
      profileType: this.domain,
      userID: this.authenticationService.currentUserValue.id,
      vote: voteAction
    }

    // API returns [profilesVotes] as well, so another call is not needed
    this.profileVotes$ = this.votingService.castVote(vote)
    .pipe(
      catchError(err => {
        this.errorMsg = err;
        return of(this.noData)
      })
    );
  }

}
