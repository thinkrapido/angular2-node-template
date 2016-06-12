
import { Component, Inject } from '@angular/core';

import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';

import { LangSelector } from './lang-selector.component';

@Component({
  selector: 'app',
  templateUrl: 'test/angular-test.view.html',
  styleUrls: ['test/angular-test.css'],
  pipes: [ TranslatePipe ],
  directives: [ LangSelector ],
})
export class AngularTestApp {
  public title = 'angular-test works!';

  constructor(@Inject(TranslateService) translate: TranslateService) {
    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(de|en)/gi.test(userLang) ? userLang : 'en';

    translate.setDefaultLang('en');

    translate.use(userLang);
  }
}
