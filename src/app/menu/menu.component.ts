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
    console.log(page)
    this.currentPage = page;
  }

  pageList = [
    { code: 'Home', name: 'Home' },
    { code: 'About', name: 'About' },
    { code: 'Map', name: 'Map' },
  ];
}
