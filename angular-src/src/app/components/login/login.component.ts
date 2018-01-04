import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
username : String;
password : String;
  constructor(  private flashMessage:FlashMessagesService ,
    private authService : AuthService,
    private router : Router) { }

  ngOnInit() {
  }
onLoginSubmit(){
const details = {
username:this.username,
password:this.password
}
this.authService.authenticateUser(details).subscribe(data =>{
if(!data.success){
this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000})
}else{
this.flashMessage.show('Logged in Successfully', {cssClass: 'alert-success', timeout: 3000});
this.authService.storeUserData(data.token,data.user)

this.router.navigate(['/dashboard'])
}
});

}
}
