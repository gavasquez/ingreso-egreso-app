import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egereso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user!.uid;

    return this.firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});
  }

  initIngresosEgresosListener(uid: string){
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => {
          return snapshot.map( doc => {
            // const data: any = doc.payload.doc.data(); => tambien se puede hacer asi
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any,
              // ...data => tambien se puede hacer asi
            }
          });
        })
      );
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user!.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

}
