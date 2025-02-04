import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  sendEmailCode: boolean = false;
  verifyCode: boolean = false;
  resendOtp: boolean = false;
  isVerified: boolean = false;
  spinner = false;
  registerForm !: FormGroup;

  constructor(private notesService: NotesService, private fb: FormBuilder, public router: Router) { }

  ngOnInit() {
    this.sendEmailCode = true;
    this.verifyCode = false;
    this.resendOtp = false;
    this.initialRigisterForm()
  }

  initialRigisterForm() {
    this.registerForm = this.fb.group({
      userName: [''],
      emailId: [''],
      otp: [''],
      password: ['']
    })
  }

  registerFormData() {
    this.notesService.registerNewUser(this.registerForm.value).subscribe({
      next: (res: any) => {
        console.log(res.message);
        this.router.navigate(['/login'])
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  sendEmail(emailId: any) {
    this.sendEmailCode = false;
    this.verifyCode = true;
    this.resendOtp = true;
    this.notesService.sendOtpToUser(emailId).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  verificationCode(emailId: any, otp: any) {
    this.sendEmailCode = false;
    this.verifyCode = false;
    this.resendOtp = false;
    this.notesService.verifyOtpfromUser(emailId, otp).subscribe({
      next: (res: any) => {
        this.spinner = true
        console.log(res.message)
        if (res.message == 'Email Validation Successfully' || res.success == true) {
          this.spinner = false;
          this.isVerified = true;

        } else {
          this.verifyCode = true;
          this.resendOtp = true;
        }
      },
      error: (error) => {
        this.verifyCode = true;
        this.resendOtp = true;
        console.log(error)
      }
    })
  }

}
