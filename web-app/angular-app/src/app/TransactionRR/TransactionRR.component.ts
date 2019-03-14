import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TransactionRRService } from './TransactionRR.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-TransactionRR',
	templateUrl: './TransactionRR.component.html',
	styleUrls: ['./TransactionRR.component.css'],
  	providers: [TransactionRRService]
})

//TransactionRRComponent class
export class TransactionRRComponent {

  //define rate of conversion
  private residentCoinsPerEnergy = 1;
  private residentEnergyPerCoin = (1 / this.residentCoinsPerEnergy).toFixed(2);  

  //define variables
  private coinsExchanged;
  private checkResultProducerEnergy = true;
  private checkResultConsumerCoins = true;

  myForm: FormGroup;
  private errorMessage;
  private transactionFrom;

  private allResidents;
  private producerResident;
  private consumerResident;
  
  private energyToCoinsObj;
  private transactionID;
  private response;

  //initialize form variables
  producerResidentID = new FormControl("", Validators.required);
	consumerResidentID = new FormControl("", Validators.required); 
	energyValue = new FormControl("", Validators.required);
	coinsValue = new FormControl("", Validators.required);
  
  constructor(private serviceTransaction:TransactionRRService, fb: FormBuilder) {
    //intialize form  
	  this.myForm = fb.group({		  
		  producerResidentID:this.producerResidentID,
		  consumerResidentID:this.consumerResidentID,
      energyValue:this.energyValue,
      coinsValue:this.coinsValue,
    });
    
  };

  //on page initialize, load all residents
  ngOnInit(): void {
    this.transactionFrom  = false;
    this.loadAllResidents()
    .then(() => {                     
            this.transactionFrom  = true;
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

  //execute transaction
  execute(form: any): Promise<any> {
          
    //loop through all residents, and get producer and consumer resident from user input
    for (let resident of this.allResidents) {      
      if(resident.residentID == this.producerResidentID.value){
        this.producerResident = resident;
      }
      if(resident.residentID == this.consumerResidentID.value){
        this.consumerResident = resident;
      }
    }

    //create transaction object
    this.energyToCoinsObj = {
      "energyRate": this.residentCoinsPerEnergy,
      "energyValue": this.energyValue.value,
      "energyReceiverId": this.consumerResidentID.value,
      "energySenderId": this.producerResidentID.value,
       
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
            }).then(() => {
              this.transactionFrom = false;
            });
}
        
          
}
