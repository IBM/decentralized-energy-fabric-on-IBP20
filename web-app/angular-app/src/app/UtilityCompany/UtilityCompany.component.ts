import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UtilityCompanyService } from './UtilityCompany.service';
import 'rxjs/add/operator/toPromise';

//provide associated components
@Component({
	selector: 'app-UtilityCompany',
	templateUrl: './UtilityCompany.component.html',
	styleUrls: ['./UtilityCompany.component.css'],
  	providers: [UtilityCompanyService]
})

//UtilityCompanyComponent class
export class UtilityCompanyComponent {

  //define variables
  myForm: FormGroup;

  private allUtilityCompanys;
  private utilityCompany;
  private currentId;
  private errorMessage;

  private coins;
  private energy;
  
  //initialize form variables
  name = new FormControl("", Validators.required);
  coinsValue = new FormControl("", Validators.required);
  energyValue = new FormControl("", Validators.required);
  energyUnits = new FormControl("", Validators.required);
      
  constructor(private serviceUtilityCompany:UtilityCompanyService, fb: FormBuilder) {
    //intialize form
    this.myForm = fb.group({
          name:this.name,      
          coinsValue:this.coinsValue,
          energyValue:this.energyValue,
          energyUnits:this.energyUnits,
    });
  };

  //on page initialize, load all utility companies
  ngOnInit(): void {
    this.loadAll();
  }

  //load all Utility Companies and the coins and energy assets associated to it 
  loadAll(): Promise<any>  {
    
    //retrieve all utilityCompanys in the utilityCompanyList array
    let utilityCompanyList = [];

    //call serviceUtilityCompany to get all utility company objects
    return this.serviceUtilityCompany.getAllUtilityCompanys()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      
      //append utilityCompanyList with the utility company objects returned
      result.forEach(utilityCompany => {
        utilityCompanyList.push(utilityCompany);
      });  
      
      //assign utilityCompanyList to allUtilityCompanys
      this.allUtilityCompanys = utilityCompanyList;
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

  //add Utility Company participant
  addUtilityCompany(form: any): Promise<any> {

    //create assets for utility company and the utility company on the blockchain network
    return this.createAssetsUtility()
      .then(() => {           
        this.errorMessage = null;
        this.myForm.setValue({
            "name":null,
            "coinsValue":null,
            "energyValue":null,          
            "energyUnits":null
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

  //create coins and energy assets associated with the Resident, followed by the Resident
  createAssetsUtility(): Promise<any> {    
    
    //create utility company participant json
    this.utilityCompany = {
          "name":this.name.value,
          "coins":this.coinsValue.value,
          "energy":this.energyValue.value,
          "energyUnits":this.energyUnits.value
    };    
    
    //call serviceUtilityCompany to add utility participant, pass created utility participant json as parameter
    return this.serviceUtilityCompany.addUtilityCompany(this.utilityCompany)
    .toPromise()
    .then(() => {
      //reload page to display the created utility company
      location.reload();                  
    });
		  
  }

  //reset form
  resetForm(): void{
    this.myForm.setValue({           
          "name":null,                 
          "coinsValue":null,
          "energyValue":null,
          "energyUnits":null,
      });
  }

}





