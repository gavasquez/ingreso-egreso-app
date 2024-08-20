import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit, OnDestroy{

  registroForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required ]],
      correo: ['', [Validators.required, Validators.email ]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  onSubmit(){
    if( this.registroForm.invalid ) return;

    this.store.dispatch(ui.isLoading()); // mostrar el cargando.

    /* Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();
      },
    }); */

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password )
        .then(credenciales => {
          /* Swal.close(); */
          this.store.dispatch(ui.stopLoading());
          this.router.navigate(['/']);
        })
        .catch( error => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        });
  }

}
