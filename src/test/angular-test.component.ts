
import { Component, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes, Router } from '@angular/router';

import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';

import { LangSelector } from './lang-selector.component';
import { AboutComponent } from './about.component';

@Component({
  selector: 'app',
  templateUrl: 'test/angular-test.view.html',
  styleUrls: ['test/angular-test.css'],
  pipes: [ TranslatePipe ],
  directives: [ ROUTER_DIRECTIVES, LangSelector ],
})
@Routes([
  { path: '/:lang/about', component: AboutComponent },
])
export class AngularTestApp {
  public title: string = 'angular-test works!';

  constructor(
      @Inject(Router) private router: Router,
      @Inject(TranslateService) translate: TranslateService
  ) {
    var userLang: string = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(de|en)/gi.test(userLang) ? userLang : 'en';

    translate.setDefaultLang('en');

    translate.use(userLang);

//    this.router.navigate([`/${userLang}`]);
  }
}
