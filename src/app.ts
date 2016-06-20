
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { AngularTestApp } from './test/angular-test.component';
import { environment } from './test/environment';
import { LocalizationService } from './services/router/localization.service';

if (environment.production) {
  enableProdMode();
}

bootstrap(AngularTestApp, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(TranslateLoader, {
    useFactory: (http: Http): TranslateLoader => new TranslateStaticLoader(http, '', '.json'),
    deps: [Http]
  }),
  LocalizationService,
  TranslateService,
]);
