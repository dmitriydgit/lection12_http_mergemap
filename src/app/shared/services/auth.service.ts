import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge } from 'rxjs';
import { retry, tap, mergeMap, pluck, map } from 'rxjs/operators';
import { DEFAULT_SETTINGS } from '../configs/config';
import { Request } from '../models/request';

@Injectable()
export class AuthService {
	private loggedIn = false;

	authUrl: string = `${this.settings.APIs.apiUrl}`;

	constructor(
		@Inject(DEFAULT_SETTINGS) private settings: any,
		private http: HttpClient) {
		// при обновлении страницы смотрим в localStorage чтоб проверить есть ли токен
		this.loggedIn = !!localStorage.getItem('auth_token');
	}

	isLoggedIn() {
		return this.loggedIn;
	}

	login(username?: string, password?: string): Observable<any> {
		return this.http.get(
			`${this.authUrl}/authentication/token/new?api_key=${this.settings.APIs.apiKey}`
		)
			.pipe(
				map((res: Request) => {
					return res.request_token;
				}),
				retry(2),
				mergeMap(res =>
					this.http.get(
						`${this.authUrl}/authentication/token/validate_with_login?username=${username}&password=${password}&request_token=${res}&api_key=${this.settings.APIs.apiKey}`
					)
				),
				tap((res: Request) => {
					if (res) {
						localStorage.setItem('auth_token', res.request_token);
						this.loggedIn = true;
					}
				}),
				mergeMap(res =>
					this.http.get(
						`${this.authUrl}/authentication/session/new?api_key=${this.settings.APIs.apiKey}&request_token=${res.request_token}`
					)
				),
				tap((res: Request) => {
					if (res) {
						localStorage.setItem('session_id', res.session_id);
					}
				}),
				mergeMap(res =>
					this.http.get(
						`${this.authUrl}/account?api_key=${this.settings.APIs.apiKey}&session_id=${res.session_id}`
					)
				),
				tap((res: Request) => {
					if (res) {
						localStorage.setItem('user_id', res.id);
						this.loggedIn = true;
					}
				})
			)
	}

	logout() {
		localStorage.removeItem('auth_token');
		localStorage.removeItem('user_id');
		localStorage.removeItem('session_id');
		this.loggedIn = false;
	}
}


