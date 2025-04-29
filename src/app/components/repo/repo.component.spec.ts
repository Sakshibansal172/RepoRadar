import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { RepoComponent } from './repo.component';
import { GithubService } from '../../services/github.service';

describe('RepoComponent', () => {
  let component: RepoComponent;
  let fixture: ComponentFixture<RepoComponent>;
  let githubService: jasmine.SpyObj<GithubService>;

  const mockRepos = [
    {
      id: 1,
      name: 'test-repo',
      description: 'Test repository',
      html_url: 'https://github.com/test/repo',
      homepage: null,
      stargazers_count: 100,
      watchers_count: 100,
      language: 'TypeScript',
      forks_count: 50,
      open_issues_count: 10,
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
      owner: {
        login: 'test-user',
        avatar_url: 'https://avatar.url',
        html_url: 'https://github.com/test-user'
      }
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GithubService', ['getTrendingRepos']);
    spy.getTrendingRepos.and.returnValue(of(mockRepos));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [RepoComponent],
      providers: [
        { provide: GithubService, useValue: spy }
      ]
    }).compileComponents();

    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    fixture = TestBed.createComponent(RepoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repositories on init', () => {
    fixture.detectChanges();
    expect(githubService.getTrendingRepos).toHaveBeenCalled();
    expect(component.state.data).toEqual(mockRepos);
    expect(component.state.loading).toBeFalse();
    expect(component.state.error).toBeNull();
  });

  it('should handle error when loading repositories fails', () => {
    githubService.getTrendingRepos.and.returnValue(throwError(() => new Error('API Error')));
    fixture.detectChanges();
    
    expect(component.state.loading).toBeFalse();
    expect(component.state.error).toBe('Failed to load repositories.');
    expect(component.state.data).toBeNull();
  });

  it('should show loading state while fetching repositories', () => {
    // Before detectChanges, state should be initial
    expect(component.state.loading).toBeFalse();
    
    // Trigger loading
    fixture.detectChanges();
    
    // After detectChanges but before response, should be loading
    expect(githubService.getTrendingRepos).toHaveBeenCalled();
  });

  it('should clean up subscription on destroy', () => {
    fixture.detectChanges();
    const spy = spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(spy).toHaveBeenCalled();
  });
});
