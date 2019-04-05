import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AllTransactionsService } from './AllTransactions.service';
import 'rxjs/add/operator/toPromise';
import { stringify } from 'querystring';

@Component({
	selector: 'app-AllTransactions',
	templateUrl: './AllTransactions.component.html',
	styleUrls: ['./AllTransactions.component.css'],
  	providers: [AllTransactionsService]
})
export class AllTransactionsComponent {

  private errorMessage;
  private allTransactions;

  private systemTransactions = [];
  private performedTransactions = [];

  private showBlockchain = [];

  constructor(private serviceTransaction:AllTransactionsService, fb: FormBuilder) {

  };


  ngOnInit(): void {

    //call to retrieve transactions
    this.loadAllTransactions();

  }

  //sort the objects on key
  sortByKey(array, key): Object[] {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  //get all transactions
  loadAllTransactions(): Promise<any> {


    //collect all transactions for display
    return this.serviceTransaction.getTransactions()
    .toPromise()
    .then((results) => {


      if (results.result === 'Success')
        {
            console.log('success'); 
            console.log('_results'); 
            console.log(results); 

            

            
            if ( results.returnBlockchain && results.returnBlockchain.length) {
                var displayBlockchain = results.returnBlockchain;
                var displayBlockchainLength = displayBlockchain.length; 

                for (var l = displayBlockchainLength -1 ; l >= 0; l--) {

                    let block = {
                      number: null,
                      data_hash: null,
                      num_transactions: null,
                      ids: null,
                      timestamps: null,
                      keys: null,
                      values: null
                    };

                    block.number = displayBlockchain[l].number;
                    block.data_hash = displayBlockchain[l].data_hash;
                    block.num_transactions = displayBlockchain[l].num_transactions;

              
                    let ids ='';
                    let timestamps = '';
                    let keys = '';
                    let values = '';
                    if ( displayBlockchain[l].transactions && displayBlockchain[l].transactions.length) {
                        
                      for (var k = 0 ; k < displayBlockchain[l].transactions.length; k++) {
                          
                          ids += displayBlockchain[l].transactions[k].id + ';' ;
                          timestamps += displayBlockchain[l].transactions[k].timestamp + ';' ;
                          
                          if ( displayBlockchain[l].transactions[k].ns_rwsets && displayBlockchain[l].transactions[k].ns_rwsets.length) {
                              var rwsets = displayBlockchain[l].transactions[k].ns_rwsets;
                              for (var j = 0 ; j < rwsets.length; j++) {
                                  if (rwsets[j].writes && rwsets[j].writes.length ) {
                                      for (var i = 0 ; i < rwsets[j].writes.length; i++) {

                                          keys += rwsets[j].writes[i].key + ';' ;
                                          values += rwsets[j].writes[i].value + ';' ;
                                          
                                          /*str += '<div class="showWrites">';
                                          str += '<p>key: ' + rwsets[j].writes[i].key + '</p>';
                                          str += '<p>value: ' + rwsets[j].writes[i].value + '</p>';
                                          str += '</div>';*/
                                      }
                                  }
                              }
                          }
                                                    
                      }    
                    }

                    block.ids = ids;
                    block.timestamps = timestamps;
                    block.keys = keys;
                    block.values = values;
                  
                    
                    this.showBlockchain.push(block);
        
                }

               
            }
            
        } else {
            this.errorMessage = results.error;            
        }
      
     
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


}
