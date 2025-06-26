import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
const API_URL = import.meta.env.NG_APP_API_URL ?? 'https://education-platform.runasp.net/';
// const API_URL = import.meta.env.NG_APP_API_URL ?? 'https://localhost:7098/';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);


  const token = auth.userSignal()?.accessToken;


  const clonedRequest = req.clone({
    withCredentials: true,
    url: API_URL + req.url,
    setHeaders: {
      //'Content-Type': 'application/json',
      //Accept: 'application/json',
      ...(auth.userSignal() &&
        auth.userSignal()?.accessToken && {
          Authorization: `Bearer ${auth.userSignal()?.accessToken}`,
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

            const decodedToken = jwtDecode<{
              name: string;
              email: string;
              id: string;
              role: ("User"|"Admin");}>(accessToken);
            const user:User = {...decodedToken,accessToken:accessToken}
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
