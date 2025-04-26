import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepoComponent } from './components/repo/repo.component';
import { RepoDetailsComponent } from './components/repo-details/repo-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path:'dashboard', component:RepoComponent},
  {path: 'project/:owner/:repo',component:RepoDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
