
import { Component, Inject } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'lang-selector',
  templateUrl: 'test/lang-selector.view.html',
  styleUrls: ['test/lang-selector.css'],
})
export class LangSelector {

  public langs: string[] = ['en', 'de'];

  constructor(
    @Inject(Router) private router: Router,
    @Inject(RouteSegment) private segment: RouteSegment,
    @Inject(TranslateService) private translate: TranslateService
  ) {
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    console.log(this.segment);
//    this.router.navigate([`/${lang}/about`]);
  }
}
