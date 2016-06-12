
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AngularTestAppComponent } from './test/angular-test.component';
import { environment } from './test/environment';

if (environment.production) {
  enableProdMode();
}

bootstrap(AngularTestAppComponent);
