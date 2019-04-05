import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Blockchain } from '../decentralized.energy.network';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class AllTransactionsService {


    constructor(private transactionService: DataService<Blockchain> ) {
    };

    //get all transactions
    public getTransactions(): Observable<Blockchain> {
        return this.transactionService.transactions();
    }

   

}
