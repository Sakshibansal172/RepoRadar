import { Component, OnDestroy, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GithubRepo } from '../../models/github.interface';
import { Subject, takeUntil } from 'rxjs';
import { LoadingStateWithData, initialLoadingStateWithData } from '../../models/loading-state.interface';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrl: './repo-details.component.css'
})
export class RepoDetailsComponent implements OnInit, OnDestroy {
  state: LoadingStateWithData<GithubRepo> = initialLoadingStateWithData<GithubRepo>();
  private destroy$ = new Subject<void>();

  constructor(
    private githubService: GithubService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const owner = this.route.snapshot.paramMap.get('owner');
    const repo = this.route.snapshot.paramMap.get('repo');
    if (owner && repo) {
      this.loadRepoDetails(owner, repo);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRepoDetails(owner: string, repo: string): void {
    this.state = { ...this.state, loading: true, error: null };
    this.githubService.getRepoDetails(owner, repo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.state = {
            loading: false,
            error: null,
            data
          };
        },
        error: (err) => {
          this.state = {
            loading: false,
            error: 'Failed to load repository details.',
            data: null
          };
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
