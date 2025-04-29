import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { RepoDetailsComponent } from './repo-details.component';
import { GithubService } from '../../services/github.service';

describe('RepoDetailsComponent', () => {
  let component: RepoDetailsComponent;
  let fixture: ComponentFixture<RepoDetailsComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let location: jasmine.SpyObj<Location>;

  const mockRepo = {
    id: 1,
    name: 'test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/test/repo',
    homepage: 'https://test-repo.com',
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
  };

  beforeEach(async () => {
    const githubSpy = jasmine.createSpyObj('GithubService', ['getRepoDetails']);
    githubSpy.getRepoDetails.and.returnValue(of(mockRepo));

    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [RepoDetailsComponent],
      providers: [
        { provide: GithubService, useValue: githubSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (param: string) => {
                  if (param === 'owner') return 'test-user';
                  if (param === 'repo') return 'test-repo';
                  return null;
                }
              }
            }
          }
        }
      ]
    }).compileComponents();

    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    fixture = TestBed.createComponent(RepoDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repository details on init', () => {
    fixture.detectChanges();
    
    expect(githubService.getRepoDetails).toHaveBeenCalledWith('test-user', 'test-repo');
    expect(component.state.data).toEqual(mockRepo);
    expect(component.state.loading).toBeFalse();
    expect(component.state.error).toBeNull();
  });

  it('should handle error when loading repository details fails', () => {
    githubService.getRepoDetails.and.returnValue(throwError(() => new Error('API Error')));
    fixture.detectChanges();
    
    expect(component.state.loading).toBeFalse();
    expect(component.state.error).toBe('Failed to load repository details.');
    expect(component.state.data).toBeNull();
  });

  it('should show loading state while fetching repository details', () => {
    expect(component.state.loading).toBeFalse();
    
    fixture.detectChanges();
    
    expect(githubService.getRepoDetails).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should clean up subscription on destroy', () => {
    fixture.detectChanges();
    const spy = spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should not load repository details if owner or repo params are missing', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [RepoDetailsComponent],
      providers: [
        { provide: GithubService, useValue: githubService },
        { provide: Location, useValue: location },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(RepoDetailsComponent);
    newFixture.detectChanges();

    expect(githubService.getRepoDetails).not.toHaveBeenCalled();
  });
});
