import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signipage',
  templateUrl: './signipage.component.html',
  styleUrls: ['./signipage.component.css']
})
export class SigninComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router,private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:3001/api/signup', this.signupForm.value).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
        
      );
      this.router.navigate(['/list']);
      this.toastr.success('Successfully Signup');


    }else{
      this.toastr.error('Please fill the details');

    }

  }
}
