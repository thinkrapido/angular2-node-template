
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { AngularTestApp } from './test/angular-test.component';
import { environment } from './test/environment';

if (environment.production) {
  enableProdMode();
}

bootstrap(AngularTestApp, [
  HTTP_PROVIDERS,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, '', '.json'),
    deps: [Http]
  }),
  TranslateService,
]);
