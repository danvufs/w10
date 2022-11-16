import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './shared/services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { CartItem } from './shared/models/cart-item';
import { ShoppingCart } from './shared/models/shopping-cart';
import { AuthService } from './shared/services/auth.service';
import {
  Router,
  NavigationEnd,
  Event as NavigationEvent,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'angularfirebase-authentication';

  public cart: Observable<ShoppingCart> | null = null;
  public cartItems: CartItem[] = [];
  public itemCount: number = 0;

  private _cartSubscription: Subscription | null = null;

  public routeFound: boolean = false;
  private _event$;
  private _routes;

  constructor(
    private _cartService: CartService, 
    private _router: Router,
    public authService: AuthService
  ) {
    console.log(this._router.config);
    this._routes = this._router.config
      .map((route) => route.path)
      .filter((route) => route != '**');
    this._event$ = this._router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd) {
        console.log(event.url);
        let url = event.url.split('/')[1];
        this._routes.filter((route) => {
          if (route!.split('/')[0] == url) {
            this.routeFound = true;
          }
        });
      }
    });
  }

  public ngOnInit(): void {
    this.cart = this._cartService.get();
    this._cartSubscription = this.cart.subscribe((cart) => {
      this.itemCount = cart.items
        .map((x) => x.quantity)
        .reduce((p, n) => p + n, 0);
    });
  }

  public ngOnDestroy(): void {
    if (this._cartSubscription) {
      this._cartSubscription.unsubscribe();
    }
  }
}
