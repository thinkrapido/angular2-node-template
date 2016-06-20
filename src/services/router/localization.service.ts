
import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class LocalizationService {

  constructor(
    @Inject(TranslateService) private _translate: TranslateService,
    @Inject(Location) private _location: Location,
    @Inject(Router) private _router: Router
  ) {
  }

  public init(path: string = null): void {

    let lang: string = navigator.language.split('-')[0]; // use navigator lang if available
    lang = /(de|en)/gi.test(lang) ? lang : 'en';

    this._translate.setDefaultLang('en');

    this._translate.use(lang);

    this.changeLanguage(lang, path);
  }

  public changeLanguage(lang: string, path: string = null): void {
    if (!!path) {
      path = `/${lang}/${path}`;
    } else {
      path = this._location.path();
      path = path.replace(/\/\w+\//, `/${lang}/`);
    }

    this._translate.use(lang);

    this._router.navigate([path]);
  }

}
