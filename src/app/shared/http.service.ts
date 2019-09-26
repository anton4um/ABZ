import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../cheerful-users/user-models/user.model";
import { FormGroup, NgForm } from "@angular/forms";
import { UserData } from "../cheerful-users/user-models/user-data.interface";
import { Token } from "@angular/compiler/src/ml_parser/lexer";

@Injectable()
export class HttpService implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  public postUserDataToUrl(url: string, formData: UserData, token: string) {
    console.log('Form Data before POst Request: ', formData);
    return this.http.post<any>(
      url,
      
        formData
        // name: formData['name'],
        // email: formData['email'],
        // phone: formData['phone'],
        // photo: formData['photo'],
        // position_id: formData['position_id'],
      ,
      {
        headers: new HttpHeaders({
          Token: token
        })
      }
    );
  }

  public getUserDataFromUrl(url) {
    return this.http.get<User>(url);
  }

  public getToken() {
    return this.http.get<{ seccess: string; token: string }>(
      "https://frontend-test-assignment-api.abz.agency/api/v1/token"
    );
  }
}
