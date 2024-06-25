import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  currentPage = 'home';
  constructor(private router: Router) {}

  ngOnInit() {
    const url = this.router.url;
    this.changeCurrentPage(url.split('/')[url.split('/').length - 1]);
  }

  changeCurrentPage(page: string) {
    this.currentPage = page;
  }

  pageList = [
    { code: 'home', name: 'Home', router: '/menu/home' },
    // { code: 'About', name: 'About', router: '/menu/about' },
    { code: 'map', name: 'Map', router: '/menu/map' },
  ];
}
