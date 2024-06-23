import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  version = environment.version;
  isShownPassword = false;
  showPassword() {
    this.isShownPassword = !this.isShownPassword;
  }
}
