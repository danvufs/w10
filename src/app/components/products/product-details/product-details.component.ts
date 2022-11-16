import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../../shared/models/product';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  
  constructor(
    private _cartService: CartService,
    private _productService: ProductsService,
    private _route: ActivatedRoute
  ) {}

  product: Observable<Product> | null = null;
  products: Observable<Product[]> | null = null;

  addToCart(product: Product) {
    this._cartService.addItem(product, 1);
  }

  ngOnInit() {
    const routeParams = this._route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('productId');

    this.products = this._productService.getProducts();

    this.product = this.products.pipe(map(products=>products.find(
      (product) => product.id === productIdFromRoute
    )!));
  }
}
