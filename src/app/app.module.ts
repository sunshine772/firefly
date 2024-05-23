import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './api/components/notfound/notfound.component';
import { MapaComponent } from './api/components/mapa/mapa.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent, NotfoundComponent, MapaComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [
    CookieService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
