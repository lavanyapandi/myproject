import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  alldata: any = [];
  currentTime: Date;

  constructor(private http: HttpClient) {
    
   }

  ngOnInit(): void {

    this.http.get('http://localhost:3001/api/getdata').subscribe(
      (response) => {
        this.alldata = response

      },
      (error) => {
        console.error(error);
      }
    );
  }
  
}



