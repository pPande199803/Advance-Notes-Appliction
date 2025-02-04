import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  baseUrl = 'http://localhost:3500/api/v1'
  // vercel url
  // baseUrl = 'https://adv-notes-backend.vercel.app/api/v1'

  constructor(private http: HttpClient) { }

  getAllUserData(){
    return this.http.get(`${this.baseUrl}/allUser`)
  }

  loginUser(userData: any) {
    return this.http.post(`${this.baseUrl}/login-user`, userData)
  }

  registerNewUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register-user`, userData)
  }

  // notes CRUD Api

  createNewNotes(note:any){
    return this.http.post(`${this.baseUrl}/notes`,note)
  }

  getAllNotesData(){
    return this.http.get(`${this.baseUrl}/allNotes`)
  }

  deleteNotesData(noteId:string){
    return this.http.delete(`${this.baseUrl}/deleteNote/${noteId}`)
  }

  updateNotesData(noteId:string, note:any){
    return this.http.put(`${this.baseUrl}/updateNotes/${noteId}`,note)
  }
  updateUserData(userId:string, user:any){
    return this.http.put(`${this.baseUrl}/updateUser/${userId}`,user)
  }

  // ==================================================

  sendOtpToUser(emailId: any) {
    return this.http.get(`${this.baseUrl}/otp-verify/${emailId}`)
  }

  verifyOtpfromUser(emailId: any, otp: any) {
    return this.http.get(`${this.baseUrl}/otp-verification/${emailId}/${otp}`)
  }

  forgetPasswordSendLink(emailId:any){
    return this.http.post(`${this.baseUrl}/forget-password`,emailId)
  }
}
