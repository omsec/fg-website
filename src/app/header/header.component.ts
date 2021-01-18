import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { User } from '../models/user';
import { UserFactory } from '../models/user-factory';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'fg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  items: MenuItem[] = [];
  public currentUser!: User // initialisiert vom auth-Service mit empty()

  constructor(
    private auth: AuthenticationService,
    private router: Router) {
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
              {label: 'Profile', icon: 'pi pi-fw pi-plus', routerLink: ['/users', user.id]} ,
              {label: 'Change Password', disabled: !loggedIn}
          ]
      },
      {
          label: 'Racing',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {label: 'Routes', icon: 'pi pi-fw pi-trash', routerLink: ['/routes']},
            {label: 'Championships', icon: 'pi pi-fw pi-refresh'}
        ]
      },
      {
        label: 'Tunes',
        icon: 'pi pi-fw pi-pencil'
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
}
