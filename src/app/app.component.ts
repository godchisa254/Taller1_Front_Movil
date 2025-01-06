import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'; 
import { TabbarComponent } from './shared/component/tabbar/tabbar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, TabbarComponent],
})
export class AppComponent {
  constructor() {}
}
