import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  menuNav = [
    {
      type: 'option', // Indica que este elemento es una opción del menú
      name: 'Inicio',
      route: 'home',
      icon: 'home',
    },
    {
      type: 'option',
      name: 'Suscripciones',
      route: 'subscriptions',
      icon: 'subscriptions',
    },
    {
      type: 'separator', // Indica que este elemento es un separador
    },
    {
      type: 'option',
      name: 'Mi perfil',
      route: 'my-profile',
      icon: 'account_circle',
    },
    {
      type: 'option',
      name: 'Historial',
      route: 'history',
      icon: 'history',
    },
    {
      type: 'option',
      name: 'Listas de repro...',
      route: 'playlist',
      icon: 'playlist_play',
    },
    {
      type: 'separator',
    },
    {
      type: 'option',
      name: 'Configuración',
      route: 'settings',
      icon: 'settings',
    },
    {
      type: 'option',
      name: 'Ayuda',
      route: 'help',
      icon: 'help',
    },
  ];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
  ngOnInit(): void {}
}
