import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { User } from '../models/user';
import { UserFactory } from '../models/user-factory';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'fg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DialogService, MessageService]
})
export class HeaderComponent implements OnDestroy {
  items: MenuItem[] = [];
  public currentUser!: User // initialisiert vom auth-Service mit empty()
  ref: DynamicDialogRef | undefined;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    public dialogService: DialogService,
    public messageService: MessageService) {
    this.auth.currentUser$.subscribe(usr => {
      this.currentUser = usr;
      this.buildMenu(usr)
    });
  }

  buildMenu(user: User): void {
    // https://primefaces.org/primeng/showcase/#/menumodel
    // evtl. eigene Function

    const loginName = user.loginName || 'Drivatar';
    const loggedIn = (user.loginName != '');
    this.items = [
      {
          label: loginName,
          items: [
              {label: 'Profile', icon: 'pi pi-fw pi-plus', routerLink: ['/users/users', user.id]} ,
              {label: 'Change Password', disabled: !loggedIn, command: () => { this.changePassword(); } }
          ]
      },
      {
          label: 'Racing',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {label: 'Routes', icon: 'pi pi-fw pi-trash', routerLink: ['/routes']},
            {label: 'New Route', icon: 'pi pi-fw pi-trash', routerLink: ['/routes/add']},
            {label: 'Championships', icon: 'pi pi-fw pi-refresh'}
        ]
      },
      {
        label: 'Tunes',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {label: 'Error Testing', icon: 'pi pi-fw pi-trash', routerLink: ['/users/test']},
          {label: 'Get Route async', icon: 'pi pi-fw pi-trash', routerLink: ['/routes/routes2', '602647c45d33677643a2b0b9']}
        ]
      },
      {
        label: 'Designs',
        icon: 'pi pi-fw pi-pencil'
      },
      {
        label: 'Community', visible: loggedIn,
        icon: 'pi pi-fw pi-pencil'
      }
    ];
  }

  logout(): void {
    this.auth.logout().subscribe(
      () => this.router.navigate(['/home']),
      (error) => {
        // eigentlich eher theoretisch oder während entwicklung.
        // falls logout nicht erfolgreich ist, das menu und den button zurücksetzen
        // dies kann bspw. sein, wenn das cookie gelöscht wurde (der local Storage wird im service gelöscht)
        this.currentUser = UserFactory.empty()
        this.buildMenu(this.currentUser)
        this.router.navigate(['/home'])
      }
    );
  }

  changePassword(): void {
    this.ref = this.dialogService.open(ChangePasswordComponent, {
      data: {
        id: '51gF3' // uzerId
      },
      header: 'Change Password',
      width: '30%'
    });

    this.ref.onClose.subscribe(pwdChanged => {
      // true | undefined
      if (pwdChanged) {
        this.messageService.add({severity: 'info', summary: 'Password changed'});
      }
    });

  }

  ngOnDestroy(): void  {
    if (this.ref) {
      this.ref.close();
    }
  }

}
