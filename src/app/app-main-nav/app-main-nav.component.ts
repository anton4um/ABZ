import { HttpService } from "./../shared/http.service";
import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";

@Component({
  selector: "app-main-nav",
  templateUrl: "./app-main-nav.component.html",
  styleUrls: ["./app-main-nav.component.min.css"]
})
export class AppMainNavComponent implements OnInit {
  superUser;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.httpService.getUserDataFromUrl(
      "https://frontend-test-assignment-api.abz.agency/api/v1/users/1"
    ).subscribe(user => {
      this.superUser = user['user'];
    });
  }
}
