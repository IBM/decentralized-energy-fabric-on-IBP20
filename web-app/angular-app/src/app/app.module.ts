import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { ResidentComponent } from './Resident/Resident.component';
import { BankComponent } from './Bank/Bank.component';
import { UtilityCompanyComponent } from './UtilityCompany/UtilityCompany.component';

import { TransactionRRComponent } from './TransactionRR/TransactionRR.component';
import { TransactionRUComponent } from './TransactionRU/TransactionRU.component';
import { TransactionRBComponent } from './TransactionRB/TransactionRB.component';

import { AllTransactionsComponent } from './AllTransactions/AllTransactions.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,

    TransactionRRComponent,
    TransactionRUComponent,
    TransactionRBComponent,

    AllTransactionsComponent,

    ResidentComponent,
    BankComponent,
    UtilityCompanyComponent
		
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8081'],
        blacklistedRoutes: ['localhost:8081/api/auth']
      }
    })
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
