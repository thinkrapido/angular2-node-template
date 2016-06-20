
import { Component, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';

import { TranslatePipe } from 'ng2-translate/ng2-translate';

import { LangSelector } from './lang-selector.component';
import { AboutComponent } from './about.component';

import { LocalizationService } from '../services/router/localization.service';

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
    @Inject(LocalizationService) private _localizationService: LocalizationService
  ) {
    this._localizationService.init('/about');
  }
}
