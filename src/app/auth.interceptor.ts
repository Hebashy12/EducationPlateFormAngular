import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, User } from './auth.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
const API_URL = import.meta.env.NG_APP_API_URL ?? 'http://127.0.0.1:5000';

//{
//   withCredentials: true,
//   headers: new HttpHeaders(
//     {
//       'Content-Type': 'application/json',
//       'Authorization': token? `Bearer ${token}`:"",
//       'Accept': 'application/json',

//     }
//   )
// setHeaders: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   Authorization: token? `Bearer ${token}`:"",
// },
// }
const config = {
  url: API_URL,
  // headers: new HttpHeaders({
  //   'Content-Type':  'application/json',
  //   'Accept': 'application/json',
  //   'Authorization': `Bearer ${localStorage.getItem('token')?? ''}`,

  // }),
  withCredentials: true,

  setHeaders: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: localStorage.getItem('token')
      ? `Bearer ${localStorage.getItem('token')}`
      : '',
  },
} as const;
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);


  const token = auth.userSignal()?.token;
  // const token = localStorage.getItem('token')??"";
  // if (token) {
   //}
  // if(req.url.includes("/refresh")) {
  //   console.log(req.url)
  //   return next(req).pipe(catchError(error => throwError(() => error)));
  // }


  const clonedRequest = req.clone({
    withCredentials: true,
    url: API_URL + req.url,
    setHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(auth.userSignal() &&
        auth.userSignal()?.token && {
          Authorization: `Bearer ${auth.userSignal()?.token}`,
        }),
    },
  });

  if (clonedRequest.url.includes('/refresh')||clonedRequest.url.includes('/login')|| clonedRequest.url.includes('/register'))
    return next(clonedRequest);


  return next(clonedRequest).pipe(

    catchError((error) => {

      if (error.status === 401) {


        return auth.refreshToken().pipe(
          tap(({ accessToken }) =>{

            const decodedToken = jwtDecode<{user:Omit<User,'token'>}>(accessToken);
            const user:User = {...decodedToken.user,token:accessToken}
            console.log(user);
            auth.userSignal.set(user);


          }

          ),
          switchMap(({ accessToken:newAccessToken }) => {
            const newRequest = req.clone({
              withCredentials: true,
              url: API_URL + req.url,
              setHeaders: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            return next(newRequest);
          }),
          catchError((refreshError) => {
            console.log(refreshError);
            auth.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );


      }
      else{
        return throwError(() => error);
      }
    })
  );
};
