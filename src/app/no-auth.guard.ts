import { CanActivateFn, Router} from '@angular/router';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = ($, _):Observable<boolean> => {

  const auth = inject(AuthService);
  const router= inject(Router);
 const user = auth.userSignal();
  const user$ = auth.user$;

  if (user !== undefined && user !== null) {
    console.log(user);
    router.navigate(['/']);
    return of(false);
  }

  else if (user !== undefined && user === null) {
    console.log(user);
    return of(true);
  }

  else{

  return user$.pipe(
    filter((user)=>user!==undefined),
    map((user)=>{
      if(user === null){
        return true;
      }
      else{
        console.log('user from noAuth guard',user);
        router.navigate(['/']);
        return false;
      }
    }),
      catchError((error) => {
        console.log(error, 'error from noAuth guard');
        router.navigate(['/']);
        return of(false)
      })
)
  }

};
