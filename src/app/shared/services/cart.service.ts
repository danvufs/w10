import { Inject, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { map, Observable, Observer, reduce } from 'rxjs';
import { ProductsService } from './products.service';
import { CartItem } from '../models/cart-item';
import { LocalStorageService } from './storage.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { async } from '@firebase/util';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { registerLocaleData } from '@angular/common';

const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _subscriptionObservable: Observable<ShoppingCart>;
  private _subscribers: Array<Observer<ShoppingCart>> = new Array<Observer<ShoppingCart>>();
  private _products: Observable<Product[]>;
  private _remoteShoppingCart: Observable<ShoppingCart[]>;
  private _user: User;
  private _storage: Storage;
  private _remoteCartId: any = null;

  constructor(
    private _productService: ProductsService,
    private _storageService: LocalStorageService,
    private _store: AngularFirestore,
    private _authService: AuthService
  ) {
    this._user = JSON.parse(localStorage.getItem('user')!);
    this._storage = this._storageService.get();
    this._products = this._productService.getProducts();
    this._remoteShoppingCart = this._store.collection('shopping_cart').valueChanges({idField: 'userId'}) as Observable<ShoppingCart[]>;

    this._subscriptionObservable = new Observable<ShoppingCart>(
      (observer: Observer<ShoppingCart>) => {
        this._subscribers.push(observer);
        observer.next(this.retrieve());
        return () => {
          this._subscribers = this._subscribers.filter(
            (obs) => obs !== observer
          );
        };
      }
    );
  }

  public get(): Observable<ShoppingCart> {
    return this._subscriptionObservable;
  }

  public addItem(product: Product, quantity: number): void {
    const cart = this.retrieve();
    let item = cart.items.find((p) => p.productId === product.id);
    if (item === undefined) {
      item = new CartItem();
      item.productId = product.id;
      cart.items.push(item);
    }

    item.quantity += quantity;

    this.calculateCart(cart);
    this.save(cart);
    this.dispatch(cart);
  }

  public empty(): void {
    const newCart = new ShoppingCart();
    this.save(newCart);
    this.dispatch(newCart);
  }

  private calculateCart(cart: ShoppingCart): void {
    cart.itemsTotal = cart.items
      .map(
        (item) => {
          let quantity = item.quantity;
          let price = (this._products.pipe(map(products=>products.find((p)=>p.id = item.productId)!.price)));
          return quantity * Number(price);
        }
      )
      .reduce((previous, current) => previous + current, 0);
    console.log('grossTotal', cart.itemsTotal);
  }

  private retrieve(): ShoppingCart {
    const cart = new ShoppingCart();
    cart.userId = this._user.uid;
    const storedCart = this._storage.getItem(CART_KEY);
    if (storedCart) {
      cart.updateFrom(JSON.parse(storedCart));
    }
    // Check if cart exists for this user.
    if (!this._remoteCartId) {
      this._store.collection('shopping_cart').doc(this._user.uid).set({
        userId: this._user.uid,
        items: cart.items,
        grossTotal: cart.grossTotal,
        itemsTotal: cart.itemsTotal
      }).then(docRef=>this._remoteCartId=docRef);
    }   
    return cart;
  }

  private save(cart: ShoppingCart): void {
    this._storage.setItem(CART_KEY, JSON.stringify(cart));
    this._store.collection('shopping_cart').doc(this._user.uid).update({
      userId: this._user.uid,
      items: cart.items,
      grossTotal: cart.grossTotal,
      itemsTotal: cart.itemsTotal
    });
  }

  private dispatch(cart: ShoppingCart): void {
    this._subscribers.forEach((sub) => {
      try {
        sub.next(cart);
      } catch (e) {
        //
      }
    });
  }
}
