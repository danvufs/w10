import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { ShoppingCart } from '../../../shared/models/shopping-cart';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public products: Observable<Product[]> | null = null;
  public cart: Observable<ShoppingCart> | null = null;
  public itemCount: number = 0;
  public cartItems: any;
  public grossTotal: any;

  private _cartSubscription: Subscription | null = null;

  public constructor(
    private _productsService: ProductsService,
    private _cartService: CartService
  ) {}

  public emptyCart(): void {
    this._cartService.empty();
  }

  public ngOnInit(): void {
    this.products = this._productsService.getProducts();
    this.cart = this._cartService.get();
    this._cartSubscription = this.cart.subscribe((cart) => {
      this.cartItems = cart.items.map((item) => {
        let product = this.products!.pipe(map(products=>products.find((p) => p.id == item.productId)));
        return { ...product, quantity: item.quantity };
      });
      this.itemCount = cart.items
        .map((x) => x.quantity)
        .reduce((p, n) => p + n, 0);
    });
    console.log('cartItems', this.cartItems);
  }

  public ngOnDestroy(): void {
    if (this._cartSubscription) {
      this._cartSubscription.unsubscribe();
    }
  }
}
