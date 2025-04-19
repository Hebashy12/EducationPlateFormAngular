import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { authResolver } from './auth.resolver';
import { noAuthGuard } from './no-auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MockComponent } from './components/mock/mock.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CoursepageComponent } from './components/coursepage/coursepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotfoundComponent } from './components/notfound/notfound.component';


export const routes: Routes = [

  { path: '', component: HomeComponent ,title:'Home',
    resolve:{user:authResolver}
  },
  { path: 'home', component: HomeComponent },
  { path: 'mock', component: MockComponent ,title:'Mock' , canActivate:[authGuard] ,
    resolve:{user:authResolver}
  },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CoursepageComponent },
  { path: 'login', component: LoginComponent ,title:'Login' , canActivate:[noAuthGuard] },
  { path: 'register', component: RegisterComponent,title:'Register', canActivate:[noAuthGuard]},
  {path :'notfound', component: NotfoundComponent, title:'Not Found'},

  { path: '**', component: NotfoundComponent,title:'Page Not Found' }
];
