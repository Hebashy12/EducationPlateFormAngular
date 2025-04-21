import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { authResolver } from './auth.resolver';
import { noAuthGuard } from './no-auth.guard';
import { MockComponent } from './components/mock/mock.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CoursepageComponent } from './components/coursepage/coursepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { VedioComponent } from './components/vedio/vedio.component';
import { CoursecontentComponent } from './components/coursecontent/coursecontent.component';


export const routes: Routes = [
  { path: '', component: CoursesComponent, title: 'Courses', resolve: { user: authResolver } },
  { path: 'courses', component: CoursesComponent },
  { path: 'mock', component: MockComponent, title: 'Mock', canActivate: [authGuard], resolve: { user: authResolver } },
  { path: 'courses/:id', component: CoursepageComponent },
  { path: 'Coursecontent', component: CoursecontentComponent },
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, title: 'Register', canActivate: [noAuthGuard] },
  { path: 'vedio', component: VedioComponent, title: 'Vedio' },
  { path: 'notfound', component: NotfoundComponent, title: 'Not Found' },
  { path: '**', component: NotfoundComponent, title: 'Page Not Found' }
];

