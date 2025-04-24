import { Injectable } from '@angular/core';
import { Course } from './course.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl="api/payment/create-checkout-session"
  constructor(private _http:HttpClient) { }
  createCheckoutSession(course: Course, userId: string) {
    return this._http.post<{ url: string }>(this.apiUrl, {
      courseId: course.courseId,
      courseName: course.title,
      amount: course.price * 100, // in cents
      userId: userId
    });
  }

}

