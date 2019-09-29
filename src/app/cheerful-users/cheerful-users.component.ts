import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertDialogComponent } from "./../alert-dialog/alert-dialog.component";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "../shared/http.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "./user-models/user.model";
import { UserPosition } from "./user-models/user-position.model";
import Inputmask from "inputmask";
import { __values } from "tslib";
import { UserData } from "./user-models/user-data.interface";

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
  imagePreview: any;
  displayShowMoreBtn: boolean = true;

  public uploadFileEl: HTMLElement;
  public signupForm: FormGroup;

  constructor(private httpService: HttpService, private http: HttpClient) {}

  ngOnInit() {
    // getting users from data base
    this.httpService.getUserDataFromUrl(this.url_users).subscribe(response => {
      this.next_url = response["links"].next_url || "";
      this.prev_url = response["links"].prev_url || "";
      this.users.push(...response["users"]);
    });
    // getting positions from data base
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
    // masking input phone in the signupForm field
    Inputmask({ mask: "+38(999) 999 99 99" }).mask(
      document.getElementById("phone")
    );

    this.uploadFileEl = document.getElementById("upload");
    this.uploadFileEl.addEventListener("change", function(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];

      // self.signupForm.patchValue({ upload: file });
      // self.signupForm.get("upload").updateValueAndValidity();
      // reading ашду on the specified path by selecting the file
      const reader = new FileReader();
      reader.onload = () => {
        self.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      // setting name of file in to input element of upload elements
      if (self.signupForm.get("upload").valid) {
        self.signupForm.get("pathToFileUpload").setValue(file.name); //event.target["files"][0].name);
      } else {
        self.signupForm.get("pathToFileUpload").markAsTouched();
      }
    });
  }
  // for validation of file attributes
  uploadFileValidator(control: FormControl): { [s: string]: boolean } {
    const el = document.getElementById("upload");
    if (
      el["files"].length === 0 ||
      (el["files"][0].size > 5242880 &&
        el["files"][0].type.indexOf("jpg") === -1)
    ) {
      return { invalidPhoto: true };
    } else {
      return null;
    }
  }
  // getting more users from server side, to show more cheerful users
  showMoreUsers() {
    this.httpService.getUserDataFromUrl(this.next_url).subscribe(
      response => {
        this.next_url = response["links"].next_url || "";
        this.prev_url = response["links"].prev_url || "";
        this.users.push(...response["users"]);
        if (response["total_pages"] === response["page"]) {
          this.displayShowMoreBtn = false;
        }
      },
      error => {
        console.log(
          "Network Error. Can not get data for showMoreUsers function: ",
          error
        );
      }
    );
  }

  async onSubmit() {
    let phoneClearValue: string;
    // clearing the phone value from the stash
    if (this.signupForm.get("phone").valid) {
      phoneClearValue = this.signupForm
        .get("phone")
        .value.replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "");
    }
    // prepering user data for sending in one object
    const userDataPost = new FormData();
    userDataPost.append("name", this.signupForm.get("username").value);
    userDataPost.append("email", this.signupForm.get("email").value);
    userDataPost.append("phone", phoneClearValue);
    userDataPost.append("position_id", this.signupForm.get("position").value);
    userDataPost.append(
      "photo",
      (this.uploadFileEl as HTMLInputElement).files[0],
      (this.uploadFileEl as HTMLInputElement).files[0].name
    );

    // getting a secret Token from the server
    await this.httpService.getToken().subscribe(
      response => {
        this.secret_token = response.token;
      },
      error => {
        console.log("Network error happened in getToken(): ", error);
      }
    );
    // posting user data to the server side
  await  this.http
      .post<UserData>(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users",
        userDataPost,
        {
          headers: new HttpHeaders({
            Token: this.secret_token
          })
        }
      )
      .subscribe(
        response => {
          if (response) {
            console.log("Response from Server", response);
            this.dialog.openDialog();
          }
        },
        error => {
          console.log("Unknown Error in Nwtwork Request", error);
        }
      );
  }
}
