import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  token: any;
  tokenData: any;
  resetPasswordForm !: FormGroup;
  allUser :any[] = [];
  currentUser:any;

  constructor(private noteService: NotesService, private router: Router,
    private fb: FormBuilder, private toastr: ToastrService, private activedRoute: ActivatedRoute) {
    this.token = this.activedRoute.snapshot.params['token'];
    console.log(this.token)
  }

  ngOnInit() {
    this.tokenData = jwtDecode(JSON.stringify(this.token));
    // console.log(this.tokenData.exp)
    const expired = this.tokenData.exp
    // console.log(expired)
    this.tokenData = (Math.floor((new Date).getTime() / 1000))

    if (this.tokenData >= expired) {
      // console.log(`Linked Has been Experired`);
      this.toastr.error(`Linked Has been Experired`, `error`)
      this.router.navigate(['/login'])
    }

    this.resetPasswordForm = this.fb.group({
      password: [''],
      confirmPassword: ['']
    })
    this.findUserByEmailId()

  }

  findUserByEmailId(){
    this.noteService.getAllUserData().subscribe({
      next:(res:any)=>{
        // console.log(res.userData)
        this.allUser = res.userData;
        this.allUser = this.allUser.filter((x)=> this.allUser[0].emailId == x.emailId)
        // console.log(this.allUser)
        this.currentUser = this.allUser[0]

      },
      error:(error)=>{
        console.log(error)
      }
    })
  }

  changePassword() {
    debugger
    if(this.resetPasswordForm.value.password === this.resetPasswordForm.value.confirmPassword){
      this.currentUser.password = this.resetPasswordForm.value.password
      this.noteService.updateUserData(this.currentUser._id, this.currentUser).subscribe({
        next:(res:any)=>{
          console.log(res.message)
          this.toastr.success(`Password Updated Successfully.`);
          this.router.navigate(['/login'])
        },
        error:(error)=>{
          this.toastr.error(`Something went worong`)
        }
      })
    }else{
      this.toastr.error(`Password and Confirm Password Not Match`, `error`)
    }

  }

}
