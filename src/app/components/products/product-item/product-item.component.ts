import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  @Input() product: Product | null = null;
}
