import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = 'Bienvenido';
  userSubs!: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ){}

  ngOnInit(): void {
    /* this.usuario = this.authService.user!; */
    this.userSubs = this.store.select('auth')
    .pipe(
      filter(({user}) => user !== null)
    ).subscribe(({user}) => {
      this.nombre  = user!.nombre;
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout(){
    this.authService.logout().then(response => {
      this.router.navigate(['/login']);
    });
  }

}
