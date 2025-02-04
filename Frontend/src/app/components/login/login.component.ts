import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private noteService: NotesService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    localStorage.setItem('notekeyToken', '')
    this.initializeFormData();
  }

  initializeFormData() {
    this.loginForm = this.fb.group({
      emailId: [''],
      password: ['']
    })
  }

  loginUser() {
    this.noteService.loginUser(this.loginForm.value).subscribe({
      next:(res:any)=>{
        console.log(`User Login Successfully`);
        localStorage.setItem('notekeyToken', res.token)
        this.router.navigate(['/notes'])
      },
      error:(error)=>{
        // console.log(error)
        this.toastr.error(`Enter Valid Details`,`error`)
      }
    })
  }

}
