import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {
  lat: Number = -5.196395;
  lng: Number = -80.630287;
  zoom: Number = 16;
  constructor() { }

  ngOnInit() {
  }

}
