import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;
  mostrarEnMovil = false;
  mostrarFormularioBusqueda = false;
  mostrarEnDesktop = false;
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
    {
      type: 'separator', // Indica que este elemento es un separador
    },
    {
      type: 'option',
      name: 'Registro',
      route: 'register',
      icon: 'add_circle',
    },

    {
      type: 'option',
      name: 'Usuarios',
      route: 'users/list',
      icon: 'people',
    },
  ];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mostrarEnMovil = window.innerWidth <= 870;
    this.mostrarEnDesktop = !this.mostrarEnMovil;
  }

  toggleFormularioBusqueda() {
    this.mostrarFormularioBusqueda = !this.mostrarFormularioBusqueda;
  }

  ngOnInit(): void {}
}
