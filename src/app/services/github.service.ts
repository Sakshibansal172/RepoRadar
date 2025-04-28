import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GithubApiResponse, GithubRepo } from '../models/github.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly apiUrl = 'https://api.github.com/';
  private readonly defaultPerPage = 20;
  private readonly defaultSearchPeriod = 30; // days

  constructor(private http: HttpClient) { }

  getTrendingRepos(
    daysAgo: number = this.defaultSearchPeriod, 
    perPage: number = this.defaultPerPage
  ): Observable<GithubRepo[]> {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateString = date.toISOString().split('T')[0];

    const params = new HttpParams()
      .set('q', `created:>${dateString}`)
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('per_page', perPage.toString());

    return this.http.get<GithubApiResponse>(`${this.apiUrl}search/repositories`, { params })
      .pipe(
        map(response => response.items),
        catchError(this.handleError)
      );
  }

  getRepoDetails(owner: string, repo: string): Observable<GithubRepo> {
    return this.http.get<GithubRepo>(`${this.apiUrl}repos/${owner}/${repo}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.status === 0) {
      errorMessage = 'A network error occurred. Please check your connection.';
    } else if (error.status === 403) {
      errorMessage = 'GitHub API rate limit exceeded. Please try again later.';
    } else if (error.status === 404) {
      errorMessage = 'Repository not found.';
    } else {
      errorMessage = error.error?.message || 'Server error occurred.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
