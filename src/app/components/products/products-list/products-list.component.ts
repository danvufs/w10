import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductsService } from '../../../shared/services/products.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  
  products: Observable<Product[]> | null = null;
  
  constructor(private _productsService: ProductsService) {}

  ngOnInit() {
    this.products = this._productsService.getProducts();
  }
}
