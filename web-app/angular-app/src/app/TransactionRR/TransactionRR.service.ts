import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Resident } from '../decentralized.energy.network';
import { EnergyTrade } from '../decentralized.energy.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRRService {

    //define namespace strings for api calls
	  private RESIDENT: string = 'Resident';    
    private ENERGY_TRADE: string = 'EnergyTrade';

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>, private energyTradeService: DataService<EnergyTrade>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }
   
    //create energy to coins transaction
    public energyTrade(itemToAdd: any): Observable<EnergyTrade> {
      return this.energyTradeService.add(this.ENERGY_TRADE, itemToAdd);
    }

}
