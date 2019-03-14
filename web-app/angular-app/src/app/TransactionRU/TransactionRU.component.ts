import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TransactionRUService } from './TransactionRU.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-TransactionRU',
	templateUrl: './TransactionRU.component.html',
	styleUrls: ['./TransactionRU.component.css'],
  	providers: [TransactionRUService]
})

//TransactionRRComponent class
export class TransactionRUComponent {

  //define rate of conversion
  private utilityCoinsPerEnergy = 1;
  private utilityEnergyPerCoins = (1 / this.utilityCoinsPerEnergy).toFixed(3);  
  
  //define variables
  private coinsExchanged;
  private energyValue;

  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allResidents;
  private allUtilityCompanys;

  private resident;
  private utiltyCompany;  
  private energyToCoinsObj;
  private transactionID;

  private response;

  private energyReceiverId;
  private energySenderId;  
  
  //initialize form variables
  formResidentID = new FormControl("", Validators.required);
	formUtilityID = new FormControl("", Validators.required); 
  action = new FormControl("", Validators.required); 
	value = new FormControl("", Validators.required);
  
  constructor(private serviceTransaction:TransactionRUService, fb: FormBuilder) {
    //intialize form    
	  this.myForm = fb.group({		  
		  formResidentID:this.formResidentID,
		  formUtilityID:this.formUtilityID,
      action:this.action,
      value:this.value,      
    });    
  };

  //on page initialize, load all residents and utility companies
  ngOnInit(): void {
    this.transactionFrom  = true;
    this.loadAllResidents()
    .then(() => {                     
            this.loadAllUtilityCompanys();
    });
    
  }

  //get all Residents
  loadAllResidents(): Promise<any> {
    
    //retrieve all residents in the tempList array
    let tempList = [];

    //call serviceTransaction to get all resident objects
    return this.serviceTransaction.getAllResidents()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the resident objects returned
      result.forEach(resident => {
        tempList.push(resident);
      });

      //assign tempList to allResidents
      this.allResidents = tempList;
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

  //get all Utility Companies
  loadAllUtilityCompanys(): Promise<any> {
    
    //retrieve all utility companies in the tempList array
    let tempList = [];

    //call serviceTransaction to get all utility company objects
    return this.serviceTransaction.getAllUtilityCompanys()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the utilty company objects returned
      result.forEach(utilityCompany => {
        tempList.push(utilityCompany);
      });

      //assign tempList to allUtilityCompanys
      this.allUtilityCompanys = tempList;
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

  //execute transaction
  execute(form: any): Promise<any> {
          
    //depending on action, identify energy and coins assets to be debited/credited
    if(this.action.value == 'buyEnergy') {

      this.energyValue = this.value.value;
      this.energyReceiverId = this.formResidentID.value;
      this.energySenderId = this.formUtilityID.value;
      
    }
    else if(this.action.value == 'sellEnergy') {
      this.energyValue = this.value.value;
      this.energyReceiverId = this.formUtilityID.value;
      this.energySenderId = this.formResidentID.value;
    }    

    
    //calculate coins exchanges from the rate
    this.coinsExchanged = this.utilityCoinsPerEnergy * this.energyValue;

    //create transaction object
    this.energyToCoinsObj = {
      "energyRate": this.utilityCoinsPerEnergy,
      "energyValue": this.energyValue,
      "energyReceiverId": this.energyReceiverId,
      "energySenderId": this.energySenderId,
    };

    
    //call serviceTransaction call the energyToCoins transaction with energyToCoinsObj as parameter
    return this.serviceTransaction.energyTrade(this.energyToCoinsObj)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      if(result.error) {
        this.errorMessage = result.error;
      } else {
        this.response = result.msg;
      }
      console.log(result);
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
    }).then(() => {
      this.transactionFrom = false;
    });


  }
        
}
