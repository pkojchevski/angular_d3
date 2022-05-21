import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: Observable<Data[]>;

  constructor(private http: HttpClient) {
    this.data = this.http.get<Data[]>('./assets/data.json');
    this.data?.subscribe(console.log);
  }
}
