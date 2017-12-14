import 'rxjs/add/operator/switchMap';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import {UserService} from './user.service';
import {User} from './user';

@Component({
  selector: 'app-user-component',
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
  user: User = new User();

  constructor(private userService: UserService,
    private route: ActivatedRoute) {
    }sss
    
  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.userService.getUser(params.get('id')))
      .subscribe(user => {
        console.log(user);
        this.user = user;
      });
  }

  save(): void {
    this.userService.updateUser(this.user)
      .then(() => console.log('success 2'));
  }
}
