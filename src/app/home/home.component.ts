import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
interface DeliveryOption {
  label: string;
  value: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  filterTimer: any;
  filterName: string;
  filterStyle: any;
  filterDelivery: any;
  dataSource: any;
  placeholderName: string;
  furnitureStyle: any = [];
  deliveryOption: Array<DeliveryOption> = [
    { label: '1 week', value: 7 },
    { label: '2 weeks', value: 14 },
    { label: '1 month', value: 30 }
  ];
  products: any = [];
  dataFurniture: any = [];
  furnitureStyleControl = new FormControl();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.placeholderName = 'Search Furniture';
    this.http
      .get('https://www.mocky.io/v2/5c9105cb330000112b649af8')
      .subscribe((data: any) => {
        if (data) {
          this.products = data;
          this.dataFurniture = _.cloneDeep(this.products);
          this.http
            .get('https://www.mocky.io/v2/5c9105cb330000112b649af8')
            .subscribe((dataStyle: any) => {
              if (dataStyle) {
                this.furnitureStyle = dataStyle.furniture_styles;
              }
            });
        }
      });
  }

  onChangeFilter() {
    let styleFilters;
    let deliveryFilters;

    if (this.filterStyle) {
      styleFilters = this.filterStyle.map(option => option).join(', ');
    }
    if (this.filterDelivery) {
      deliveryFilters = this.filterDelivery
        .map(option => option.value)
        .join(', ');
    }

    const filteredProducts = this.products.products.filter(product => {
      const deliveryTime = this.filterDelivery
        ? this.filterDelivery.map(option => option.value)
        : [];
      const maxDeliveryTime =
        deliveryTime.length > 0 ? Math.max(deliveryTime) : null;
      if (!maxDeliveryTime && (!this.filterStyle || this.filterStyle.length === 0) ) {
        return product;
      }
      if (!maxDeliveryTime) {
        return product.furniture_style.some(item =>
          this.filterStyle.includes(item)
        );
      } else if (!this.filterStyle || this.filterStyle.length === 0) {
        return product.delivery_time <= maxDeliveryTime;
      } else {
        return (
          product.furniture_style.some(item =>
            this.filterStyle.includes(item)
          ) && product.delivery_time <= maxDeliveryTime
        );
      }
    });
    this.dataFurniture.products = filteredProducts;
  }
}
