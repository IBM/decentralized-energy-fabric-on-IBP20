import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TransactionRBService } from './TransactionRB.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-TransactionRB',
	templateUrl: './TransactionRB.component.html',
	styleUrls: ['./TransactionRB.component.css'],
  	providers: [TransactionRBService]
})

//TransactionRBComponent class
export class TransactionRBComponent {
  
  //define rate of conversion
  private bankCoinsPerCash = 10;
  private bankCashPerCoins = (1 / this.bankCoinsPerCash).toFixed(3);
  
  //define variables
  private coinsExchanged;
  private cashValue;
  
  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allResidents;
  private allBanks;

  private resident;
  private bank;  
  private cashToCoinsObj;
  private transactionID;
  private response;

  private cashReceiverId;
  private cashSenderId;

  //initialize form variables
  formResidentID = new FormControl("", Validators.required);
  formBankID = new FormControl("", Validators.required); 
  action = new FormControl("", Validators.required); 
  value = new FormControl("", Validators.required);	  
  
  constructor(private serviceTransaction:TransactionRBService, fb: FormBuilder) {
    //intialize form
	  this.myForm = fb.group({		  
		  formResidentID:this.formResidentID,
		  formBankID:this.formBankID,
      action:this.action,
      value:this.value,      
    });   
  };

  //on page initialize, load all residents and banks
  ngOnInit(): void {
    this.transactionFrom  = true;
    this.loadAllResidents()
    .then(() => {                     
            this.loadAllBanks();
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

  //get all Banks
  loadAllBanks(): Promise<any> {
    
    //retrieve all banks in the tempList array
    let tempList = [];
    
    //call serviceTransaction to get all bank objects
    return this.serviceTransaction.getAllBanks()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append tempList with the bank objects returned
      result.forEach(bank => {
        tempList.push(bank);
      });

      //assign tempList to allBanks
      this.allBanks = tempList;
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
  
    //depending on user action, identify cash and coins assets to be debited/credited
    if(this.action.value == 'getCash') {
      this.cashValue = this.value.value;
      this.cashReceiverId = this.formResidentID.value;
      this.cashSenderId = this.formBankID.value;
    }
    else if(this.action.value == 'getCoins') {      
      this.cashValue = this.value.value;
      this.cashReceiverId = this.formBankID.value;
      this.cashSenderId = this.formResidentID.value;
    } 
  
    //create transaction object
    this.cashToCoinsObj = {
      "cashRate": this.bankCoinsPerCash,
      "cashValue": this.cashValue,
      "cashReceiverId": this.cashReceiverId,
      "cashSenderId": this.cashSenderId,
    };

       
    //call serviceTransaction call the cashToCoins transaction with cashToCoinsObj as parameter 
    return this.serviceTransaction.cashTrade(this.cashToCoinsObj)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      if(result.error) {
        this.errorMessage = result.error;
      } else {
        this.response = result.msg;
      }
      console.log(result)     
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
    })
    .then(() => {
      this.transactionFrom = false;
    });
  
  }

}
