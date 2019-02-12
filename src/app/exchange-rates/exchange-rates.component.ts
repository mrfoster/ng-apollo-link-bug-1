import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-exchange-rates',
  template: `
    <div *ngIf="loading">
      Loading...
    </div>
    <div *ngIf="errors">
      Error :(
    </div>
    <div *ngIf="rates">
      <div *ngFor="let rate of rates">
        <p>{{ rate.currency }}: {{ rate.rate }}</p>
      </div>
    </div>
  `
})
export class ExchangeRatesComponent implements OnInit {
  rates: any[];
  loading = true;
  errors: any;
  args = { currency: 'USD' };

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query Rates($currency: String!) {
            rates(currency: $currency) {
              currency
              rate
            }
          }
        `,
        variables: this.args,
        fetchPolicy: 'no-cache'
      })
      .valueChanges.subscribe(result => {
        this.rates = result.data && result.data.rates;
        this.loading = result.loading;
        this.errors = result.errors;
      });
  }
}
