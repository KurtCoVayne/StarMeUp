import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styles: [`:host {
    position: fixed,
    top: 0,
    left: 0
}  `]
})
export class HomeNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
