import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from './shared/services/user.service';
import {UserModel} from './shared/models/user.model';
import {Router} from '@angular/router';
import {TitleService} from './shared/services/title.service';
import {LoadingPageService} from './shared/services/loading-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Subscriptions
  userSub;
  // End

  title = 'time-tracker-front';
  user: UserModel;
  sideBar: object[];

  loadingPage: boolean;
  constructor(
    private http: HttpClient,
    public userService: UserService,
    private router: Router,
    private titleService: TitleService,
    private loadingPageService: LoadingPageService
  ) {

    if (this.userService.getToken()) {
      console.log('logged in')
      this.userService.getProfile().subscribe(
        (value: any) => this.userService.updateUser(new UserModel(value.user)),
        error => {
          this.router.navigateByUrl('/auth/login');
          this.handleSideBar(false);
        });
    } else {
      this.handleSideBar(false);
      this.router.navigateByUrl('/auth/login').then();
    }

    this.userSub = this.userService.getUser().subscribe(
      value => {
        this.user = value;
        if (value !== null) {
          this.handleSideBar(true);
        } else {
          this.router.navigateByUrl('/auth/login').then();
          this.handleSideBar(false);
        }
      });

    this.titleService.setPageDetail();
    this.loadingPageService.getLoadingPage().subscribe(
      value => this.loadingPage = value
    );
  }

  handleSideBar(loggedIn: boolean) {
    if (loggedIn) {
      this.sideBar = [
        {
          name: 'Time Tracker',
          url: 'tracker',
          icon: 'timer'
        },
        {
          name: 'Dashboard',
          url: 'dashboard',
          icon: 'bar_chart'
        },
        {
          name: 'My projects',
          url: 'tracker/projects',
          icon: 'pending_actions'
        },
        {
          name: 'Logout',
          url: '/auth/logout',
          icon: 'logout'
        }
      ];
    } else {
      this.sideBar = [
        {
          name: 'Login',
          url: 'auth/login',
          icon: 'login',
        },
        {
          name: 'Sign up',
          url: 'auth/signup',
          icon: 'person_add'
        }
      ];
    }
  }
}
