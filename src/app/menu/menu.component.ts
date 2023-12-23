import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  currentPage = 'Home';
  changeCurrentPage(page: string) {
    this.currentPage = page;
  }

  pageList = [
    { code: 'Home', name: 'Home', router: '/menu/home' },
    { code: 'About', name: 'About', router: '/menu/about' },
    { code: 'Map', name: 'Map', router: '/menu/map' },
  ];
}
