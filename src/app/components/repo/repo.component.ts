import { Component, OnDestroy, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { GithubRepo } from '../../models/github.interface';
import { Subject, takeUntil } from 'rxjs';
import { LoadingStateWithData, initialLoadingStateWithData } from '../../models/loading-state.interface';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrl: './repo.component.css'
})
export class RepoComponent implements OnInit, OnDestroy {
  state: LoadingStateWithData<GithubRepo[]> = initialLoadingStateWithData<GithubRepo[]>();
  private destroy$ = new Subject<void>();

  constructor(private githubService: GithubService) { }

  ngOnInit(): void {
    this.loadRepositories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRepositories(): void {
    this.state = { ...this.state, loading: true, error: null };
    this.githubService.getTrendingRepos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (repos) => {
          this.state = {
            loading: false,
            error: null,
            data: repos
          };
        },
        error: (err) => {
          this.state = {
            loading: false,
            error: 'Failed to load repositories.',
            data: null
          };
        }
      });
  }
}
