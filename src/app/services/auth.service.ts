import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!: Subscription;
  private _user: Usuario | null = null;

  get user() {
    return this._user;
  }

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>,
  ) { }

  initAuthListener(){
    this.auth.authState.subscribe(fsUser => {
      if(fsUser){
        this.userSubscription = this.firestore.doc(`${fsUser.uid}/usuario`).valueChanges().subscribe( fireStoreUser => {
          const user = Usuario.fromFirebase(fireStoreUser);
          this._user = user;
          this.store.dispatch(authActions.setUser( { user: user} ) );
        });
      }else {
        this.userSubscription.unsubscribe();
        this._user = null;
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });

  }

  crearUsuario(nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({user}) => {
        const newUser = new Usuario(user!.uid, nombre, user!.email ? user!.email: 'No tiene email');
        return this.firestore.doc(`${user!.uid}/usuario`)
        .set({...newUser});
      });
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      // map sirve para mapear la respuesta y devolver la respuesta que queramos
      map(fbUser => fbUser != null),
    );
  }
}
