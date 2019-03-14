import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ResidentService } from './Resident.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-Resident',
	templateUrl: './Resident.component.html',
	styleUrls: ['./Resident.component.css'],
  	providers: [ResidentService]
})

//ResidentComponent class
export class ResidentComponent {

  //define variables
  myForm: FormGroup;

  private allResidents;
  private resident;
  private currentId;
  private errorMessage;

  private coins;
  private energy;
  private cash;

  //initialize form variables
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  coinsValue = new FormControl("", Validators.required);
  energyValue = new FormControl("", Validators.required);
  energyUnits = new FormControl("", Validators.required);
  cashValue = new FormControl("", Validators.required);
  cashCurrency = new FormControl("", Validators.required);
      
  constructor(private serviceResident:ResidentService, fb: FormBuilder) {
    //intialize form
    this.myForm = fb.group({       
          firstName:this.firstName,      
          lastName:this.lastName,
          coinsValue:this.coinsValue,
          energyValue:this.energyValue,
          energyUnits:this.energyUnits,
          cashValue:this.cashValue,
          cashCurrency:this.cashCurrency          
    });
  };

  //on page initialize, load all residents
  ngOnInit(): void {
    this.loadAll();
  }

  //load all residents and the energy, coins and cash assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all residents in the residentList array
    let residentList = [];

    //call serviceResident to get all resident objects
    return this.serviceResident.getAllResidents()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append residentList with the resident objects returned
      result.forEach(resident => {
        residentList.push(resident);
      });     

      //assign residentList to allResidents
      this.allResidents = residentList;
    })
    .catch((error) => {
      if(error == 'Server error'){
          this.errorMessage = "Could not connect to REST server. Please check your configuration details";
      }
      else if(error == '404 - Not Found'){
      this.errorMessage = "404 - Could not find API route. Please check your available APIs."
      }
      else{
          this.errorMessage = error;
      }
    });
    

  }

  //add Resident participant
  addResident(form: any): Promise<any> {

    //create assets for resisent and the resident on the blockchain network
    return this.createAssetsResident()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "firstName":null,
            "lastName":null,
            "coinsValue":null,
            "energyValue":null,
            "energyUnits":null,
            "cashValue":null,
            "cashCurrency":null
        });
      })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if (error == '500 - Internal Server Error') {
          this.errorMessage = "Input error";
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  //create coins, energy and cash assets associated with the Resident, followed by the Resident
  createAssetsResident(): Promise<any> {
    
    //create resident participant json
    this.resident = {
          "firstName":this.firstName.value,
          "lastName":this.lastName.value,
          "coins":this.coinsValue.value,
          "cash":this.cashValue.value,
          "cashCurrency":this.cashCurrency.value,
          "energy":this.energyValue.value,
          "energyUnits":this.energyUnits.value
      };    
          
    //call serviceResident to add resident participant, pass created resident participant json as parameter
    return this.serviceResident.addResident(this.resident)
    .toPromise()
    .then(() => {
      //reload page to display the created resident
      location.reload();
    });            
       
  }

  //reset form
  resetForm(): void{
    this.myForm.setValue({           
          "firstName":null,       
          "lastName":null,
          "coinsValue":null,
          "energyValue":null,
          "energyUnits":null,
          "cashValue":null,
          "cashCurrency":null
      });
  }

}
