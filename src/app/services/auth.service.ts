import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { }

  initAuthListener(){
    this.auth.authState.subscribe(fireBaseUser => {
      console.log(fireBaseUser);
      console.log(fireBaseUser?.uid);
      console.log(fireBaseUser?.email);
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
