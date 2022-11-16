import { Injectable, EventEmitter, Output } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  
  products = this._store.collection('products').valueChanges({idField: 'id'}) as Observable<Product[]>;

  constructor(
    private _store: AngularFirestore
  ) { }

  @Output() event = new EventEmitter();

  getProducts() {
    return this.products;
  }
}
