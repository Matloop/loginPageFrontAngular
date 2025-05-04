import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatMenuModule,
        MatButtonModule,
        MatIconModule,
      MatToolbarModule,
      RouterLink
      ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router : Router){

  }
  title = 'loginpageangular';
  logout(){
    ss : void sessionStorage.setItem("auth-token", "");
    ss2 : void sessionStorage.setItem("username", "");
    this.router.navigate(["/login"]);

  }
}
