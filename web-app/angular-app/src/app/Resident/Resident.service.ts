import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Resident } from '../decentralized.energy.network';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class ResidentService {

    //define namespace strings for api calls
		private RESIDENT: string = 'Resident';  

    //use data.service.ts to create services to make API calls
    constructor(private residentService: DataService<Resident>) {
    };

    //get all resident objects on the blockchain network
    public getAllResidents(): Observable<Resident[]> {
        return this.residentService.getAll(this.RESIDENT);
    }

    //get resident by id
    public getResident(id: any): Observable<Resident> {
      return this.residentService.getSingle(this.RESIDENT, id);
    }

    //add resident
    public addResident(itemToAdd: any): Observable<Resident> {
      return this.residentService.add(this.RESIDENT, itemToAdd);
    }

}
