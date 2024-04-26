import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { OnePieceService } from 'src/app/services/one-piece.service';
import { Season } from 'src/app/models/season.model';
import { Episode } from 'src/app/models/episode.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  episode_number = '';
  seasons: Season[] = [];
  episodes: Episode[] = [];
  selectedSeason = '';

  loading: boolean = false;
  limitError: boolean = false;

  languageSvc = inject(LanguageService);
  onePieceSvc = inject(OnePieceService);
  selectedLanguage = '';

  ngOnInit() {
    this.selectedLanguage = localStorage.getItem('language') as string;
    this.getSeasons();
  }

  // Cambiar idioma
  setLanguage() {
    this.languageSvc.setLanguage(this.selectedLanguage);
    this.getSeasons();
  }

  // Obtener temporadas
  getSeasons() {
    this.loading = true;

    this.onePieceSvc.getSeasons().subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log(res);
        this.seasons = res.seasons;
        this.selectedSeason = this.seasons[0].id;

        this.getEpisodesBySeason();
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 429) {
          this.limitError = true;
        }
      }
    })
  }

  // Obtener episodios por temporadas
  getEpisodesBySeason() {
    this.loading = true;

    this.onePieceSvc.getEpisodesBySeason(this.selectedSeason).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log(res);
        this.episodes = res.episodes;
      }
    })
  }

  // Obtener episodios
  getEpisodesByNumber() {
    this.loading = true;

    if (this.episode_number) {
      this.onePieceSvc.getEpisodeByNumber(this.episode_number).subscribe({
        next: (res: any) => {
          this.loading = false;
          console.log(res);
          this.episodes = [res.episode]
        },
        error: (err: any) => {
          this.loading = false;
          this.episodes = [];
        }
      })
    } else {
      this.getEpisodesByNumber();
    }
  }

}
