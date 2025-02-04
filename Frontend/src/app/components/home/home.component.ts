import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  isDarkTheme = false;
  tags: any[] = [];
  notesData: any[] = [];
  tagData: any;
  isPinned = false;
  themeColor: any;
  tokenData: any;
  notesFormData !: FormGroup;
  notesId: any;
  isAdded: boolean = false;
  isEdit: boolean = false;
  spinner: boolean = false;
  noSearchData: boolean = false;
  searchText = ''
  UserName=''

  constructor(public router: Router, public fb: FormBuilder, public notesService: NotesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const tokenValid = localStorage.getItem('notekeyToken')
    if(tokenValid == ''){
      this.router.navigate(['/login'])
    }
    this.tokenData = jwtDecode(JSON.stringify(tokenValid));
    this.toastr.success(`Welcome ${this.tokenData.UserName}`)
 if (tokenValid !== '') {
      this.router.navigate(['/notes'])
      this.UserName = this.tokenData.UserName
    } else {
      this.router.navigate(['/login'])
      this.toastr.error(`Token Expired or Invalid`, `error`)
    }
    this.initilizeFormData()
    this.getAllNotesData();
  }

  initilizeFormData() {
    this.tags = []
    this.isAdded = true;
    this.isEdit = false;
    this.notesFormData = this.fb.group({
      title: [''],
      content: [''],
      color: this.themeColor,
      tags: [this.tags],
      pinned: false
    })
  }

  getAllNotesData() {
    this.spinner = true
    this.notesService.getAllNotesData().subscribe({
      next: (res: any) => {
        // console.log(res)
        // console.log(res.message);
        this.spinner = false
        this.notesData = res.notesData
        this.notesData.sort((a, b) => {
          return b.pinned - a.pinned
        })
      }
    })
  }

  saveNotesData() {
    console.log(this.notesFormData.value)
    this.notesService.createNewNotes(this.notesFormData.value).subscribe({
      next: (res: any) => {
        this.toastr.success(`Note Added Successfully`, `Congratulations`);
        this.getAllNotesData()
        // console.log(res.message)
        let ref = document.getElementById('close');
        ref?.click()
        this.notesFormData.reset();
      },
      error: (error) => {
        console.log(error)
        this.toastr.error(`Something Went Worong`, `error`);
      }
    })
  }

  editFormData(note: any) {
    this.tags = []
    this.isAdded = false;
    this.isEdit = true;
    this.notesId = note._id;
    note.tags.forEach((entry: any) => {
      // console.log(entry);
      this.tags.push(entry)
    })
    this.notesFormData.setValue({
      title: note.title,
      content: note.content,
      color: note.color,
      tags: this.tags,
      pinned: note.pinned
    })
  }

  updateNotesFormData() {
    // console.log(this.notesId)
    // console.log(this.notesFormData.value)
    this.notesService.updateNotesData(this.notesId, this.notesFormData.value).subscribe({
      next: () => {
        // console.log(res.message);
        this.toastr.success(`Note Updated Successfully`, `Congratulations`);
        let ref = document.getElementById('close');
        ref?.click();
        this.getAllNotesData()
      },
      error: (error) => {
        // console.log(error)
        this.toastr.error(`Something Went Worong`, `error`);
      }
    })
  }


  deleteNotesData(noteId: any) {
    if (confirm("Are you sure to delete Note.")) {
      this.notesService.deleteNotesData(noteId).subscribe({
        next: () => {
          this.toastr.success(`Note Deleted Successfully`, `Congratulations`)
          // console.log(res.message);
          this.getAllNotesData()
        },
        error: (error) => {
          // console.log(error)
          this.toastr.error(`Something Went Worong`, `error`);

        }
      })
    }
  }

  setPinned(note: any) {
    // console.log(note.pinned)
    if (note.pinned == false) {
      this.notesFormData.setValue({
        title: note.title,
        content: note.content,
        color: note.color,
        tags: this.tags,
        pinned: true
      })
      this.notesService.updateNotesData(note._id, this.notesFormData.value).subscribe({
        next: () => {
          // console.log(res.message);
          this.toastr.success(`Note Pinned Successfully`, `Congratulations`);
          this.getAllNotesData()
        },
        error: (error) => {
          // console.log(error)
          this.toastr.error(`Something Went Worong`, `error`);
        }
      })
    } else if (note.pinned == true) {
      this.notesFormData.setValue({
        title: note.title,
        content: note.content,
        color: note.color,
        tags: this.tags,
        pinned: false
      })
      this.notesService.updateNotesData(note._id, this.notesFormData.value).subscribe({
        next: () => {
          // console.log(res.message);
          this.toastr.success(`Note UnPinned Successfully`, `Congratulations`);
          this.getAllNotesData()
        },
        error: (error) => {
          // console.log(error)
          this.toastr.error(`Something Went Worong`, `error`);
        }
      })

    }
  }

  searchNotes() {
    console.log(this.searchText)
    this.notesData = this.notesData.filter((x: any) => {
      return this.searchText.toLocaleLowerCase() === x.title.toLocaleLowerCase()
    })
    if (this.notesData = []) {
      this.noSearchData = true
    }
  }
  trackSearchNote() {
    if (this.searchText === '') {
      this.getAllNotesData()
      this.noSearchData = false
    }
  }

  // toggleTheme() {

  //   this.isDarkTheme = !this.isDarkTheme;
  //   const themeClass = 'dark-theme';

  //   if (this.isDarkTheme) {
  //     this.renderer.addClass(document.body, themeClass);
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     this.renderer.removeClass(document.body, themeClass);
  //     localStorage.setItem('theme', 'light');
  //   }
  // }

  theme1() {
    this.notesFormData.value.color = 'red'
  }
  theme2() {
    this.notesFormData.value.color = 'green'
  }
  theme3() {
    this.notesFormData.value.color = 'yellow'
  }
  theme4() {
    this.notesFormData.value.color = 'violet'
  }
  theme5() {
    this.notesFormData.value.color = 'blue'
  }
  theme6() {
    this.notesFormData.value.color = 'orange'
  }

  addTags(tag: any) {
    if (tag === '') return;
    if (this.tags.length <= 5) {
      this.tags.push(tag)
    }
    this.tagData = ''
    // console.log(this.tags)
  }
  removeTag(id: any) {
    this.tags.splice(id, 1)
  }

  logout() {
    localStorage.setItem('notekeyToken', '');
    this.router.navigate(['/login'])
  }

}
