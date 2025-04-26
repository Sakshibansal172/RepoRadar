import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-repo-details',
  templateUrl: './repo-details.component.html',
  styleUrl: './repo-details.component.css'
})
export class RepoDetailsComponent implements OnInit{
  repoDetails: any;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private githubService:GithubService,
    private route:ActivatedRoute,
    private location:Location
  ){ }

  ngOnInit(): void {
    const owner = this.route.snapshot.paramMap.get('owner');
    const repo = this.route.snapshot.paramMap.get('repo');
    if (owner && repo) {
      this.githubService.getRepoDetails(owner,repo).subscribe({
        next:(data) => {
          this.repoDetails = data;
          this.loading = false;
        },
        error:(err) =>{
          this.error = 'Failed to load repository details.';
          this.loading = false;
        }
      })
    }
  }

  goBack(): void {
    this.location.back();
  }
}
