import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'restart',
  templateUrl: './restart.component.html',
  styleUrls: ['./restart.component.css']
})
export class RestartComponent implements AfterViewInit {
  constructor(protected _router: Router) {
    // Constructor

  }
  async clear() {
    const keys = await window.caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
  }

  ngAfterViewInit(): void {
    const self = this;
    setTimeout(() => {
      self._router.navigate(['//']);
    }, 1000);
    self.clear();
  }
}
