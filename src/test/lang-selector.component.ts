
import { Component, Inject } from '@angular/core';

import { LocalizationService } from '../services/router/localization.service';

@Component({
  selector: 'lang-selector',
  templateUrl: 'test/lang-selector.view.html',
  styleUrls: ['test/lang-selector.css'],
})
export class LangSelector {

  public langs: string[] = ['en', 'de'];

  constructor(
    @Inject(LocalizationService) private _localizationService: LocalizationService
  ) {
  }

  setLang(lang: string): void {
    this._localizationService.changeLanguage(lang);
  }
}
