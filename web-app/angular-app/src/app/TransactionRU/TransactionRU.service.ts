import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Resident } from '../decentralized.energy.network';
import { UtilityCompany } from '../decentralized.energy.network';
import { EnergyTrade } from '../decentralized.energy.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TransactionRUService {

    //define namespace strings for api calls
	  private RESIDENT: string = 'Resident';
    private UTILITYCOMPANY: string = 'UtilityCompany'; 
    private ENERGY_TRADE: string = 'EnergyTrade';

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>, private utilityCompanyService: DataService<UtilityCompany>, private energyTradeService: DataService<EnergyTrade>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }

    //get all utilty company objects on the blockchain network
    public getAllUtilityCompanys(): Observable<UtilityCompany[]> {
        return this.utilityCompanyService.getAll(this.UTILITYCOMPANY);
    }    
   
    //create energy to coins transaction
    public energyTrade(itemToAdd: any): Observable<EnergyTrade> {
      return this.energyTradeService.add(this.ENERGY_TRADE, itemToAdd);
    }
 

}
