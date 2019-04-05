import { Component } from '@angular/core';
import { AuthService } from './home.service';
import { first } from 'rxjs/operators';

//provide associated components
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [AuthService]
})
export class HomeComponent {

	public error: string;
	public authorized: boolean;

	constructor(private auth:AuthService) { }

	public authorize() {
		this.auth.login()
		.toPromise()
		.then((result) => {
			console.log(result.token);
			alert("Authorized Access");
			localStorage.setItem('access_token', result.token);
      	});     	

	}

	public unAuthorize() {
		alert("Removed Access");
		localStorage.removeItem('access_token');
	}
}
