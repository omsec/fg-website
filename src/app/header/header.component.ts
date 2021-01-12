import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'fg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {

    // https://primefaces.org/primeng/showcase/#/menumodel
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

}
