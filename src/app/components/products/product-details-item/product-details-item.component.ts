import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-product-details-item',
  templateUrl: './product-details-item.component.html',
  styleUrls: ['./product-details-item.component.css']
})
export class ProductDetailsItemComponent implements OnInit {

  constructor(private _cartService: CartService) { }

  ngOnInit(): void {
  }

  @Input() product: Product | null = null;

  addToCart(product: Product) {
    this._cartService.addItem(product, 1);
  }

}
