import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { UtilityCompany } from '../decentralized.energy.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class UtilityCompanyService {

    //define namespace strings for api calls
    private UTILITYCOMPANY: string = 'UtilityCompany';  
      
    //use data.service.ts to create services to make API calls
    constructor(private utilityCompanyService: DataService<UtilityCompany>) {
    };

    //get all utility company objects on the blockchain network
    public getAllUtilityCompanys(): Observable<UtilityCompany[]> {
        return this.utilityCompanyService.getAll(this.UTILITYCOMPANY);
    }

    //get utility company by id
    public getUtilityCompany(id: any): Observable<UtilityCompany> {
      return this.utilityCompanyService.getSingle(this.UTILITYCOMPANY, id);
    }

    //add utility company
    public addUtilityCompany(itemToAdd: any): Observable<UtilityCompany> {
      return this.utilityCompanyService.add(this.UTILITYCOMPANY, itemToAdd);
    }

}
