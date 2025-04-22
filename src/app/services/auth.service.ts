import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface User
{
  email: string;
  id: string;
  name: string;
  role: 'Admin' | 'User';
  accessToken: string;
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
    return this.http.get('api/Course/All-Courses')
  }
  public refreshToken() {
    return this.http.post<{ accessToken: string }>('refresh',{});
  }

  public login(loginData: LoginDto) {

    return this.http.post<User>(

      'login',loginData

    );
  }

  public register(registerData: RegisterDto) {
    return this.http.post<User>(
      'register',registerData );
  }

  public logout() {
    return this.http.post<User>(
      'logout',{}

    );
  }
}
