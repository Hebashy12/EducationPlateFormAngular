import { computed, inject } from '@angular/core';
import { CanActivateFn, MaybeAsync, Router } from '@angular/router';
import { AuthService, User } from './auth.service';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (_, state): Observable<boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const userSignal = auth.userSignal;
  const user = auth.userSignal();
  const user$ = auth.user$;
  const isAuth = computed(() => !!auth.userSignal());
  const is_Auth = isAuth();

  //other way with signals and observables

  if (user !== undefined && user !== null) {
    console.log(user);
    return of(true);
  } else if (user !== undefined && user === null) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return of(false);
  } else {
    return user$.pipe(
      filter((user) => user !== undefined),
      map((user) => {
        if (user === null) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        } else {
          console.log('user from auth guard', user);
          return true;
        }
      }),
      catchError((error) => {
        console.log(error, 'error from auth guard');
        router.navigate(['/login']), { queryParams: { returnUrl: state.url } };
        return of(false);
      })
    );
  }

  //using signals only

  //   if(user){
  //     console.log(user)
  //     return of(true)
  //   }

  //  else if(user===null){
  //     router.navigate(['/login']);
  //     return of(false);
  //       }

  // //if (user===undefined)
  //  else {

  //   return auth.refreshToken().pipe(
  //     map(({accessToken})=>{
  //        const decodedUser = jwtDecode<{ user: Omit<User, 'token'> }>(
  //               accessToken
  //             );
  //             const user: User = { ...decodedUser.user, token: accessToken };
  //             auth.userSignal.set(user);
  //             console.log("refresh user from auth resolver", user);
  //             return true;
  //     }),
  //     catchError((refreshError) => {
  //           console.log('refresh error from auth Guard', refreshError);
  //           auth.userSignal.set(null);
  //           router.navigate(['/login']);
  //           return  of(false);
  //         }),

  //   );

  // }

  // if(!is_Auth){
  //   console.log('not auth')
  //   router.navigate(['/login']);
  //   return false
  // }

  //   return true;
};
