
import { Component, Inject } from '@angular/core';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'lang-selector',
  templateUrl: 'test/lang-selector.view.html',
  //styleUrls: ['test/lang-selector.css'],
})
export class LangSelector {

  public langs = ['en', 'de'];

  constructor( @Inject(TranslateService) private translate: TranslateService) {
  }

  setLang(lang: string): void {
    this.translate.use(lang);
  }
}
