import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService]
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTrendingRepos', () => {
    it('should return trending repositories', () => {
      const mockResponse = {
        items: [mockRepo],
        total_count: 1
      };

      service.getTrendingRepos().subscribe(repos => {
        expect(repos).toEqual([mockRepo]);
      });

      const date = new Date();
      date.setDate(date.getDate() - 30);
      const dateString = date.toISOString().split('T')[0];

      const req = httpMock.expectOne(request => 
        request.url === 'https://api.github.com/search/repositories' &&
        request.params.get('q') === `created:>${dateString}` &&
        request.params.get('sort') === 'stars' &&
        request.params.get('order') === 'desc'
      );
      
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle network errors', () => {
      service.getTrendingRepos().subscribe({
        error: (error) => {
          expect(error.message).toBe('A network error occurred. Please check your connection.');
        }
      });

      const req = httpMock.expectOne(request => 
        request.url === 'https://api.github.com/search/repositories'
      );
      
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle rate limit errors', () => {
      service.getTrendingRepos().subscribe({
        error: (error) => {
          expect(error.message).toBe('GitHub API rate limit exceeded. Please try again later.');
        }
      });

      const req = httpMock.expectOne(request => 
        request.url === 'https://api.github.com/search/repositories'
      );
      
      req.flush('Rate limit exceeded', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('getRepoDetails', () => {
    it('should return repository details', () => {
      service.getRepoDetails('test-user', 'test-repo').subscribe(repo => {
        expect(repo).toEqual(mockRepo);
      });

      const req = httpMock.expectOne('https://api.github.com/repos/test-user/test-repo');
      expect(req.request.method).toBe('GET');
      req.flush(mockRepo);
    });

    it('should handle repository not found', () => {
      service.getRepoDetails('test-user', 'non-existent').subscribe({
        error: (error) => {
          expect(error.message).toBe('Repository not found.');
        }
      });

      const req = httpMock.expectOne('https://api.github.com/repos/test-user/non-existent');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle server errors', () => {
      service.getRepoDetails('test-user', 'test-repo').subscribe({
        error: (error) => {
          expect(error.message).toBe('Server error occurred.');
        }
      });

      const req = httpMock.expectOne('https://api.github.com/repos/test-user/test-repo');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
