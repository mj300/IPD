import {
   Error,
   LoginInfo,
   AlertObj,
   PurifyComponent,   Role
} from 'twomj-core-ts';
import { AccessClaims } from './AppConst';

export {
   Error,
   LoginInfo,
   AlertObj,
   PurifyComponent,
   Role
};


export class User {
   id: number;
   userName: string;
   firstName: string;
   surname: string;
   registeredDate: Date;
   role: Role;
   tempPassword: string;
   phoneNumber: string;
   email: string;

   constructor(user = {
      id: 0,
      userName: "",
      firstName: "",
      surname: "",
      registeredDate: new Date(),
      role: new Role(),
      tempPassword: "",
      phoneNumber: "",
      email: "",
   }) {
      this.id = user.id;
      this.userName = user.userName;
      this.firstName = user.firstName;
      this.surname = user.surname;
      this.registeredDate = user.registeredDate;
      this.role = user.role;
      this.tempPassword = user.tempPassword;
      this.phoneNumber = user.phoneNumber;
      this.email = user.email;
   }
}


export class Lang {
   name: string;
   value: string;
   constructor(name: string, value: string) {
      this.name = name;
      this.value = value;
   }
}


