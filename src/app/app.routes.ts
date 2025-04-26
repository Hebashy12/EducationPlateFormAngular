import { Routes } from '@angular/router';

import { authGuard } from './Guards/auth.guard';
import { authResolver } from './Resolvers/auth.resolver';
import { noAuthGuard } from './Guards/no-auth.guard';
import { MockComponent } from './components/mock/mock.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CoursepageComponent } from './components/coursepage/coursepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { VedioComponent } from './components/vedio/vedio.component';
import { CoursecontentComponent } from './components/coursecontent/coursecontent.component';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { UpdateCourseComponent } from './components/update-course/update-course.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { courseResolver } from './Resolvers/course.resolver';
import { coursesResolver } from './Resolvers/courses.resolver';
import { categoryResolver } from './Resolvers/category.resolver';
import { courseCategoryResolver } from './Resolvers/courseCategory.resolver';
import { sectionsResolver } from './Resolvers/sections.resolver';

import { ChatBotComponent } from './components/chat-bot/chat-bot.component';


import { ProfileComponent } from './components/profile/profile.component';
import { studentCourseResolver } from './Resolvers/student-course.resolver';
import { AddVideoComponent } from './components/add-video/add-video.component';
import { UpdateVideoComponent } from './components/update-video/update-video.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';
import { AddQuizComponent } from './components/add-quiz/add-quiz.component';
import { AddSectionComponent } from './components/add-section/add-section.component';
import { UpdateQuizComponent } from './components/update-quiz/update-quiz.component';
import { UpdateSectionComponent } from './components/update-section/update-section.component';


export const routes: Routes = [

  {path:'addQuiz/:courseId',component:AddQuizComponent,title:'Add Quiz' , pathMatch: "full" },

  {path:'', redirectTo: '/courses', pathMatch: 'full'},
  {
    path: 'courses', pathMatch:"prefix" ,
    children: [
      { path: '', component: CoursesComponent ,title:'Courses' , pathMatch: "full" , resolve: { user: authResolver , courses: coursesResolver , categories:categoryResolver} },
      { path: 'courseContent/:id', component: CoursecontentComponent , pathMatch: "full",resolve: {course: courseResolver, sections:sectionsResolver } },

      { path: 'chat-bot', component: ChatBotComponent , title: 'ITI ChatBot' , pathMatch: "full" },
      { path: 'list',component:CoursesListComponent,title:'Course List' , pathMatch: "full" },
      { path: 'add', component: AddCourseComponent , title:'Add Course', pathMatch: "full"  },
      { path: 'update/:id', component: UpdateCourseComponent, title: 'Update Course' , pathMatch: "full" },
      { path: 'details/:id', component: CourseDetailsComponent , title: 'Course Details', pathMatch: "full" , resolve: { course: courseResolver } },
      { path: 'coursePage/:id', component: CoursepageComponent , pathMatch: "full" , resolve: { course: courseResolver , sections:sectionsResolver , studentCourse:studentCourseResolver} },//, category: courseCategoryResolver,

      { path: '**', component: NotfoundComponent, title: 'Page Not Found' }
    ]
  },
  {path:'profile', component:ProfileComponent, title:'Profile', resolve:{studentCourse:studentCourseResolver}},

  // { path: '', component: CoursesComponent, title: 'Courses', resolve: { user: authResolver } },
  // { path: 'courses', component: CoursesComponent },


  {path:'profile', component:ProfileComponent, title:'Profile', resolve:{studentCourse:studentCourseResolver}},


  { path: 'addVideo/:courseId', component: AddVideoComponent, title: 'Add Video' , pathMatch: "full" },
  { path: 'updateVideo/:videoId', component: UpdateVideoComponent, title: 'Update Video' , pathMatch: "full" },
  { path: 'addCategory', component: AddCategoryComponent, title: 'Add Category' , pathMatch: "full" },
  { path: 'updateCategory/:CategoryId', component: UpdateCategoryComponent, title: 'Update Category' , pathMatch: "full" },
  { path: 'addSection', component: AddSectionComponent, title: 'Add Section' , pathMatch: "full" },
  { path: 'updateSection/:sectionId', component: UpdateSectionComponent, title: 'Update Section' , pathMatch: "full" },

  {path:'updateQuiz/:quizId',component:UpdateQuizComponent,title:'Update Quiz' , pathMatch: "full" },


  { path: 'vedio', component: VedioComponent, title: 'Vedio' ,pathMatch: "full" },
  { path: 'mock', component: MockComponent, title: 'Mock', canActivate: [authGuard], resolve: { user: authResolver } ,pathMatch: "full"},
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [noAuthGuard] ,pathMatch: "full" },
  { path: 'register', component: RegisterComponent, title: 'Register', canActivate: [noAuthGuard] ,pathMatch: "full" },
  { path: 'notfound', component: NotfoundComponent, title: 'Not Found' ,pathMatch: "full" },
  { path: '**', component: NotfoundComponent, title: 'Page Not Found' }
];

