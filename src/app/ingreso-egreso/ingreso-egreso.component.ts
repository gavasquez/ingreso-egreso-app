import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egereso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: ``
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>,
  ){}

  ngOnInit(): void {

    this.loadingSubs = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });

    this.ingresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });

  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  onSubmit(){

    if(this.ingresoForm.invalid) return;

    this.store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;
    const { uid, ...rest } = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(rest)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch(error => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', error.message, 'error');
      });
  }

}
