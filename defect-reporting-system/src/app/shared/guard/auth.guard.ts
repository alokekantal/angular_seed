import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
		let currentUser = JSON.parse(localStorage.getItem('loginInfo'));
        if (currentUser && currentUser[0].token) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
