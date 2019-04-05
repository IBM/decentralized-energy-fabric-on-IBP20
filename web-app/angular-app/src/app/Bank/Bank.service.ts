import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Bank } from '../decentralized.energy.network';


import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class BankService {

    //define namespace strings for api calls
		private BANK: string = 'Bank';  
  
    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Bank>) {
    };

    //get all bank objects on the blockchain network
    public getAllBanks(): Observable<Bank[]> {
        return this.residentService.getAll(this.BANK);
    }

    //get bank by id
    public getBank(id: any): Observable<Bank> {
      return this.residentService.getSingle(this.BANK, id);
    }

    //add bank
    public addBank(itemToAdd: any): Observable<Bank> {
      return this.residentService.add(this.BANK, itemToAdd);
    }

   
}
