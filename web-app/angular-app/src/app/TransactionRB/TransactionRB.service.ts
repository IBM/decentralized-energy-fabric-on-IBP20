import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Resident } from '../decentralized.energy.network';
import { Bank } from '../decentralized.energy.network';
import { CashTrade } from '../decentralized.energy.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRBService {

    //define namespace strings for api calls
	  private RESIDENT: string = 'Resident';
    private BANK: string = 'Bank'; 
    private CASH_TRADE: string = 'CashTrade';

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>, private bankService: DataService<Bank>, private cashTradeService: DataService<CashTrade>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }

    //get all bank objects
    public getAllBanks(): Observable<Bank[]> {
        return this.bankService.getAll(this.BANK);
    }

    //create cash to coins transaction
    public cashTrade(itemToAdd: any): Observable<CashTrade> {
      return this.cashTradeService.add(this.CASH_TRADE, itemToAdd);
    }

}
