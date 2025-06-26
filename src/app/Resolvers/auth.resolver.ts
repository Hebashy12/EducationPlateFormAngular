import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export const authResolver: ResolveFn<User | null> = ($,_) => {
  const auth = inject(AuthService);
  return auth.refreshToken().pipe(
    map(({accessToken}) => {
      const decodedUser = jwtDecode<{
        name: string;
        email: string;
        id: string;
        role: ("User"|"Admin");}>(
        accessToken
      );
      const user: User = { ...decodedUser, accessToken: accessToken };
      auth.userSignal.set(user);
      console.log("refresh user from auth resolver", user);
      return user;
    }),
    catchError((refreshError) => {
      console.log('refresh error from auth resolver', refreshError);
      auth.userSignal.set(null);
      return  of(null);
    })
  );
};
