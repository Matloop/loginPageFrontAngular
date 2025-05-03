import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  url : string = "http://localhost:8080/address"
  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]>{
    return this.http.get<Address[]>(this.url);
  }

}
