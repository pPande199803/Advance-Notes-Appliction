import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import {RouterModule, RouterOutlet } from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastrModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  title = 'advance-note-app';
  isDarkTheme = false;
  toastr = inject(ToastrService)


  constructor(private renderer: Renderer2){}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  toggleTheme() {

    this.isDarkTheme = !this.isDarkTheme;
    const themeClass = 'dark-theme';

    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, themeClass);
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, themeClass);
      localStorage.setItem('theme', 'light');
    }
  }
}
