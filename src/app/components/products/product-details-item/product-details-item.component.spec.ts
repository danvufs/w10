import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsItemComponent } from './product-details-item.component';

describe('ProductDetailsItemComponent', () => {
  let component: ProductDetailsItemComponent;
  let fixture: ComponentFixture<ProductDetailsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
