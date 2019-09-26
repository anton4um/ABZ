import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.css"]
})
export class LoginDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  password: string;
  email: string;

  

  public openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogOverviewDialog, {
      width: "350px",
      // data: { email: this.email, password: this.password }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }

  ngOnInit() {}

  
}

@Component({
  selector: "app-login-dialog-overview-dialog",
  templateUrl: "./login-dialog-overview-dialog.html"
})
// tslint:disable-next-line: component-class-suffix
export class LoginDialogOverviewDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogOverviewDialog>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  isInLoginMode = true;
  authForm: FormGroup;

  ngOnInit(){
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    });
  }
  switchLoginMode(){
    this.isInLoginMode = !this.isInLoginMode;
  }

  onSubmit(){
    console.log('Auth Form: ', this.authForm.value);
    this.authForm.reset();
    // this.dialogRef.close();
  }
}
