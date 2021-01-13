import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'fg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  public currentUser!: User // initialisiert vom auth-Service mit empty()

  constructor(
    private auth: AuthenticationService,
    private router: Router) {
    this.auth.currentUser$.subscribe(usr => this.currentUser = usr);
  }

  ngOnInit(): void {

    // https://primefaces.org/primeng/showcase/#/menumodel
    // evtl. eigene Function
    this.items = [
      {
          label: 'Drivatar',
          items: [{
                  label: 'Profile',
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label: 'Project'},
                      {label: 'Other'},
                  ]
              },
              {label: 'Change Password'},
              {label: 'Logout'}
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
      }
    ];
  }

  logout(): void {
    this.auth.logout().subscribe(
      () => this.router.navigate(['/home'])
    );
  }
}
