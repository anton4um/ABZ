import { Token } from "@angular/compiler/src/ml_parser/lexer";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { UserData } from "./user-models/user-data.interface";
import { AlertDialogComponent } from "./../alert-dialog/alert-dialog.component";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { HttpService } from "../shared/http.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "./user-models/user.model";
import { UserPosition } from "./user-models/user-position.model";
import { Response } from "selenium-webdriver/http";
import Inputmask from "inputmask";
import { __values } from "tslib";

declare var $: any;
@Component({
  selector: "app-cheerful-users",
  templateUrl: "./cheerful-users.component.html",
  styleUrls: ["./cheerful-users.component.min.css"]
})
export class CheerfulUsersComponent implements OnInit, AfterViewInit {
  @ViewChild(AlertDialogComponent, { static: false })
  public dialog: AlertDialogComponent;

  url_users: string =
    "https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6";
  url_positions: string =
    "https://frontend-test-assignment-api.abz.agency/api/v1/positions";
  users: User[] = [];
  next_url: string;
  prev_url: string;
  userPositions: UserPosition[] = [];
  secret_token: string;
  imagePreview: string;
  displayShowMoreBtn: boolean = true;
  public uploadFileEl: HTMLElement;
  public signupForm: FormGroup;


  constructor(private httpService: HttpService, private http: HttpClient) {}

  ngOnInit() {
    this.httpService.getUserDataFromUrl(this.url_users).subscribe(response => {
      this.next_url = response["links"].next_url || "";
      this.prev_url = response["links"].prev_url || "";
      this.users.push(...response["users"]);
    });
    this.httpService
      .getUserDataFromUrl(this.url_positions)
      .subscribe(response => {
        this.userPositions = response["positions"];
      });
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl("", Validators.required),
      position: new FormControl(null, Validators.required),
      upload: new FormControl(null, [
        Validators.required,
        this.uploadFileValidator
      ]),
      pathToFileUpload: new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit() {
    const self = this;
    Inputmask({ mask: "+38(999) 999 99 99" }).mask(
      document.getElementById("phone")
    );

    this.uploadFileEl = document.getElementById("upload");
    this.uploadFileEl.addEventListener("change", function(event: Event) {

      const file = (event.target as HTMLInputElement).files[0];

      self.signupForm.patchValue({ upload: file });
      self.signupForm.get("upload").updateValueAndValidity();
      console.log(
        "Our File",
        file,
        "Once change event of Upload ",
        self.signupForm
      );

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        self.imagePreview = reader.result as string;
      };

      if (self.signupForm.get("upload").valid) {
        self.signupForm
          .get("pathToFileUpload")
          .setValue(event.target["files"][0].name);
      } else {
        self.signupForm.get("pathToFileUpload").markAsTouched();
      }
    });
  }

  uploadFileValidator(control: FormControl): { [s: string]: boolean } {
    const el = document.getElementById("upload");
    if (
      el["files"].length > 0 &&
      (el["files"][0].size > 5242880 &&
        el["files"][0].type.indexOf("jpg") === -1)
    ) {
      return { invalidPhoto: true };
    } else {
      return null;
    }
  }

  showMoreUsers() {
    this.httpService.getUserDataFromUrl(this.next_url).subscribe(response => {
      this.next_url = response["links"].next_url || "";
      this.prev_url = response["links"].prev_url || "";
      this.users.push(...response["users"]);
      if(response['total_pages'] === response['page']){
        this.displayShowMoreBtn = false;
      }
    });
  }

  async onSubmit() {
    let phoneClearValue: string;

    if (this.signupForm.get("phone").valid) {
      phoneClearValue = this.signupForm
        .get("phone")
        .value.replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "");
    }

    const userDataSend: any = {
      name: this.signupForm.get("username").value,
      email: this.signupForm.get("email").value,
      phone: phoneClearValue,
      photo: this.imagePreview,
      position_id: +this.signupForm.get("position").value
    };
    await this.httpService.getToken().subscribe(
      response => {
        this.secret_token = response.token;
        console.log(
          "Token response: ",
          response,
          "secret token: ",
          response.token
        );
      },
      error => {
        console.log("Network error happened in getToken(): ", error);
      }
    );
    this.http
      .post<any>(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users",
        userDataSend,
        {
          headers: new HttpHeaders({
            Token: this.secret_token
          })
        }
      )
      .subscribe(
        response => {
          console.log("Response from Server", response);
        },
        error => {
          console.log("Unknown Error in Nwtwork Request", error);
        }
      );
    // this.httpService
    //   .postUserDataToUrl(
    //     "https://frontend-test-assignment-api.abz.agency/api/v1/users",

    //     {
    //       name: this.signupForm.get("username").value,
    //       email: this.signupForm.get("email").value,
    //       phone: phoneClearValue,
    //       photo: this.uploadFileEl["files"][0],
    //       position_id: +this.signupForm.get("position").value
    //       //...userDataSend
    //       // 'name': "jhone",
    //       // 'email': "asd@google.com",
    //       // 'phone': "+380955388485",
    //       // 'photo': this.uploadFileEl['files'][0],
    //       // 'position_id': 3
    //     },
    //     this.secret_token
    //   )
    //   .subscribe(
    //     response => {
    //       if (response) {
    //         console.log(
    //           "Response to the data base of ABZTestTask was succeed!!!",
    //           response
    //         );
    //         this.signupForm.reset();

    //         // console.log("Document Active Element: ", document.activeElement);
    //         // this.signupForm.markAsPristine();
    //         // this.signupForm.markAsUntouched();
    //         // this.signupForm.get("username").markAsUntouched();
    //         // this.signupForm.get("email").markAsUntouched();
    //         // this.signupForm.get("position").markAsUntouched();
    //         // this.signupForm.get("phone").markAsUntouched();
    //         // this.signupForm.get("upload").markAsUntouched();
    //         // this.signupForm.get("pathToFileUpload").markAsUntouched();
    //         this.dialog.openDialog();
    //       }
    //     },
    //     error => {
    //       console.log("Unknown Error Happened!!!", error);
    //       this.signupForm.reset();
    //     }
    //   );
  }
}
