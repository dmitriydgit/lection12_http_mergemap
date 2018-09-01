import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_SETTINGS } from '../configs/config';
import { Request } from '../models/request';



@Injectable({
	providedIn: 'root'
})

export class BookAndFavService {

	constructor(
		@Inject(DEFAULT_SETTINGS) private settings: any,
		private http: HttpClient) {
	}

	user_id: string = localStorage["user_id"];
	api_key: string = localStorage["api_key"];
	session_id: string = localStorage["session_id"];


	authUrl: string = `${this.settings.APIs.apiUrl}`;
	localApiUrl: string = 'http://localhost:3000/';
	favoriteApiUrl: string = this.localApiUrl + 'films/favorites';
	bookmarkApiUrl: string = this.localApiUrl + 'films/bookmarks';

	filmsFavoriteList: Array<number> = [];
	filmsBookmarkList: Array<number> = [];
	actorsFavoriteList: Array<number> = [];

	getFavorites(ids?: Array<number>) {
		return this.http.get(
			`${this.authUrl}/account/${this.user_id}/favorite/movies?api_key=${this.settings.APIs.apiKey}&session_id=${this.session_id}`
		)
	}

	getBookmarks(ids: Array<number>) {
		return this.http.get(`${this.bookmarkApiUrl}?filmIds=${ids.join(',')}`)
	}

	addFilmToFavorite(id: number, user: string) {
		return this.http.post(
			`${this.authUrl}/account/${this.user_id}/favorite?api_key=${this.settings.APIs.apiKey}&session_id=${this.session_id}`,
			{
				"media_type": "movie",
				"media_id": id,
				"favorite": true
			})
	}

	removeFromFavorite(id: number) {
		return this.http.post(
			`${this.authUrl}/account/${this.user_id}/favorite?api_key=${this.settings.APIs.apiKey}&session_id=${this.session_id}`,
			{
				"media_type": "movie",
				"media_id": id,
				"favorite": false
			})
	}

	getRequestBody(id: string, act: boolean) {
		return
	}

	addFilmToBookmark(id: number, user: string) {
		this.filmsBookmarkList.push(id);
		return this.http.post(this.bookmarkApiUrl, { filmId: id, user: user }).subscribe(
			(res: any) => {
				console.log("Bookmark done!")
			});
	}


	removeFromBookmark(id) {
		return this.http.delete(`${this.localApiUrl}films/${id}/bookmarks`).subscribe(
			(res: any) => {
				console.log("Removed!")
			});
	};

}