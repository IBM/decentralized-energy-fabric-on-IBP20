

   export class Resident {
      msg: string;
      error: string;
   }
   export class Bank {
      msg: string;
      error: string;
   }
   export class UtilityCompany {
      msg: string;
      error: string;
   }   
   export class EnergyTrade  {   
      msg: string;
      error: string;
   }    
   export class CashTrade  {      
      msg: string;
      error: string;
   }   

   export class Blockchain  {
      result: string;
      returnBlockchain: Block[];
      error: string;
   }
   
   export class Block  {
      number: number;
      data_hash: string;
      num_transactions: number;
      transactions: Transaction[];   
   }

   export class Transaction  {
      id: string;
      timestamp: string; 
      ns_rwsets: Ns_rwsets[];
   }

   export class Ns_rwsets  {
      writes: Write[];
   }

   export class Write  {
      key: string;
      value: string;
   }

