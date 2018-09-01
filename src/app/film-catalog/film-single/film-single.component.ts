import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { FilmService } from '../../shared/services/film.service';
import { Film } from '../../shared/models/film';
//import { GoodsService } from '../../shared/services/goods.service';


@Component({
	selector: 'app-film-single',
	templateUrl: './film-single.component.html',
	styleUrls: ['./film-single.component.css']
})
export class FilmSingleComponent implements OnInit {



	film: any;
	dataCategory: string = "films";
	imgPath: string = this.filmsService.midImgPath;
	genres: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private filmsService: FilmService
	) {
	}


	ngOnInit() {
		console.log("film-single is active!")
		this.activatedRoute.params.subscribe((params: Params) => {
			const id = +params['id'];
			//console.log(id)
			this.filmsService.getItemById(id, this.dataCategory)
				.subscribe(film => {
					//console.log(film)
					this.film = film;
					this.genres = this.film.genres;
				});
		})
	}

	goBack() {
		this.router.navigate(['/films']);
	}

}
