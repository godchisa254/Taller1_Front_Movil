import { Component, inject } from '@angular/core'; 
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/user/service/auth.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/user/service/local-storage.service';
@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule],
})
export class TabbarComponent   {
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  constructor(private router: Router) { }
  isAuth: boolean =  this.localStorageService.getVariable('isAuthenticated') === "true" ? true : false;
  ngOnInit() { 
    addIcons({ library, playCircle, radio, search });
 
 
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuth = status;   
      console.log('isAuth:', this.isAuth);   
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`tabs${route}`]);
  }
}
