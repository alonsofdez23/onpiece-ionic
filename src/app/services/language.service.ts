import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  translate = inject(TranslateService);

  setInitialLanguage() {
    let language = this.translate.getBrowserLang() as string;
    let saveLang = localStorage.getItem('language');

    this.translate.setDefaultLang(language);

    if (saveLang) {
      this.setLanguage(saveLang);
    } else {
      this.setLanguage(language);
    }
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
