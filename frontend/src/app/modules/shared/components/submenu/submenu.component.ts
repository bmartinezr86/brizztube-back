import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css'],
})
export class SubmenuComponent {
  @Input() showSubmenu: boolean = false;
  @Output() onOptionClick = new EventEmitter<string>();
  menuNav = [
    {
      type: 'option',
      name: 'Mi perfil',
      route: 'my-profile',
      icon: 'person',
    },
    {
      type: 'option',
      name: 'Configuración',
      route: 'settings',
      icon: 'settings',
    },
    {
      type: 'option',
      name: 'Cerrar sesión',
      route: 'sign-out',
      icon: 'logout',
    },
  ];

  handleOptionClick(option: string) {
    this.onOptionClick.emit(option);
  }
}
