import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface User
{
  engineerId?: string | null;
  clientId?: string | null;
  email: string;
  id: string;
  name: string;
  role: 'admin' | 'user';
  token: string;
}

interface LoginDto
{
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterDto
{
  email: string;
  password: string;
  role: 'user' | 'admin';
  type: 'client' | 'engineer';
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
userSignal = signal<User | null | undefined>(undefined!);
user$  = toObservable(this.userSignal);

  constructor(private readonly http: HttpClient) {}


  public ApiCall(){
    return this.http.get('/jobs/paginated')
  }
  public refreshToken() {
    return this.http.post<{ accessToken: string }>('/refresh',{});
  }

  public login(loginData: LoginDto) {
   // const { email, password, rememberMe } = loginData;

    return this.http.post<User>(

      '/login',loginData







     // { email, password, rememberMe }
      // ,
      // {
      //   responseType: 'json',
      //   observe: 'response',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   withCredentials: true,
      // }
    );
  }

  public register(registerData: RegisterDto) {
   // const { email, password, firstName, lastName, role, type } = registerData;
    return this.http.post<User>(
      '/register',registerData
      // {
      //   password,
      //   email,
      //   firstName,
      //   lastName,
      //   role,
      //   type,
      // }
      // ,
      // {
      //   responseType: 'json',
      //   observe: 'response',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   withCredentials: true,
      // }
    );
  }

  public logout() {
    return this.http.post<User>(
      '/logout',{}

      // ,
      // {
      //   responseType: 'json',
      //   observe: 'response',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   withCredentials: true,
      // }
    );
  }
}
