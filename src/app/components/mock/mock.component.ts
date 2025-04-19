import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-mock',
  imports: [],
  templateUrl: './mock.component.html',
  styleUrl: './mock.component.css'
})
export class MockComponent implements OnInit{
  auth = inject(AuthService);
  ngOnInit(): void {
    this.auth.ApiCall().subscribe(
      {
        next: (data) => {
          console.log('API call successful:');
          console.log(data);
        },
        error: (error) => {
          console.log('API call failed:');
          console.log(error);
        }

      }
    )

  }

}
