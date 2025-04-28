export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  owner: GithubOwner;
}

export interface GithubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubApiResponse {
  items: GithubRepo[];
  total_count: number;
}
