import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {

  constructor( private noteService : NotesService, private router:Router,
    private fb : FormBuilder, private toastr:ToastrService
  ){}

  forgetForm !: FormGroup;

  ngOnInit() {
    this.forgetForm = this.fb.group({
      emailId:['']
    })
  }

  restPasswordLinkSend(){
    // console.log(this.emailId)
    this.noteService.forgetPasswordSendLink(this.forgetForm.value).subscribe({
      next:()=>{
        this.toastr.success(`Reset Password Link Send On EmailId`)
        console.log(`Forget Password Link Send On Email`);
        this.router.navigate(['/login'])
      },
      error:(error)=>{
        this.toastr.error(`Something went worong Rest Password`)
        console.log(error)
      }
    })

  }

}
