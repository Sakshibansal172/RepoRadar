import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/';

  constructor(private http:HttpClient) { }

  getTrendingRepos():Observable<any>{
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const dateString = date.toISOString().split('T')[0]; 

    return this.http.get(`${this.apiUrl}search/repositories`,{
      params: {
        q: `created:>${dateString}`,
        sort: 'stars',
        order: 'desc',
        per_page: '20'
      }
    }).pipe(
      map((response:any) => response.items)
    );
  }

  getRepoDetails(owner:string, repo:string):Observable<any>{
    return this.http.get(`${this.apiUrl}repos/${owner}/${repo}`);
  }
}
