import { Component,OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrl: './repo.component.css'
})
export class RepoComponent implements OnInit {
  repositories: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private githubService: GithubService) { }

  ngOnInit(): void {
    this.githubService.getTrendingRepos().subscribe({
      next: (repos) =>{
        this.repositories = repos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repositories.';
        this.loading = false;
      }
    })
  }

}
