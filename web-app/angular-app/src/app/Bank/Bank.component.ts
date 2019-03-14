import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BankService } from './Bank.service';   //from Bank.service.ts
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-Bank',
	templateUrl: './Bank.component.html',
	styleUrls: ['./Bank.component.css'],
  	providers: [BankService]
})

//BankComponent class
export class BankComponent {

  //define variables
  myForm: FormGroup;
  
  private allBanks;
  private bank;
  private currentId;
  private errorMessage;

  private coins;
  private energy;
  private cash;
  
  //initialize form variables
  name = new FormControl("", Validators.required);      
  coinsValue = new FormControl("", Validators.required);      
  cashValue = new FormControl("", Validators.required);
  cashCurrency = new FormControl("", Validators.required);
      
  constructor(private serviceBank:BankService, fb: FormBuilder) {
    //intialize form
    this.myForm = fb.group({  
          name:this.name,      
          coinsValue:this.coinsValue,
          cashValue:this.cashValue,
          cashCurrency:this.cashCurrency          
    });
  };

  //on page initialize, load all banks
  ngOnInit(): void {
    this.loadAll();
  }  

  //load all banks and the coins and cash assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all banks in the bankList array
    let bankList = [];

    //call serviceBank to get all bank objects
    return this.serviceBank.getAllBanks()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append bankList with the bank objects returned
      result.forEach(bank => {
        bankList.push(bank);
      });
      
      //assign bankList to allBanks
      this.allBanks = bankList;
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

  //add bank participant
  addBank(form: any): Promise<any> {

    //create assets for bank and the bank on the blockchain network
    return this.createAssetsBank()
      .then(() => {           
        this.errorMessage = null;

        //set form values to null
        this.myForm.setValue({
            "name":null,
            "coinsValue":null,
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

  //create coins and cash assets associated with the Bank, followed by the Bank
  createAssetsBank(): Promise<any> {
    
    //create bank participant json
    this.bank = {
          "name":this.name.value,
          "coins":this.coinsValue.value,
          "cash":this.cashValue.value,
          "cashCurrency":this.cashCurrency.value
    };
    
    //call serviceBank to add bank participant, pass created bank participant json as parameter
    return this.serviceBank.addBank(this.bank)
    .toPromise()
    .then(() => {
        //reload page to display the created bank
        location.reload();
    });
		 
  }
 

  //reset form
  resetForm(): void{
    this.myForm.setValue({
          "name":null,       
          "coinsValue":null,
          "cashValue":null,
          "cashCurrency":null
      });
  }  

}





