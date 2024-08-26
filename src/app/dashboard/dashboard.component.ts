import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { filter, Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs!: Subscription;
  ingresosEgrosSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService,
  ){}

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
    .pipe(
      // Filtramos y si cumple la condicion que lo deje pasar, si es null no llega a susbcribirse
      filter( auth => auth.user !== null ))
    .subscribe( auth => {
      const { uid } = auth.user!;
      this.ingresosEgrosSubs = this.ingresoEgresoService.initIngresosEgresosListener(uid)
        .subscribe(ingresosEgresos => {
          this.store.dispatch(ingresoEgresoActions.setItems({ items: ingresosEgresos }));
        });
    });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresosEgrosSubs?.unsubscribe();
  }

}
