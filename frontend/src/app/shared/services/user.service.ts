import { Injectable } from '@angular/core';
import {OrderType} from "../../../types/order.type";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  updateUserInfo(params: UserInfoType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + "user", params)
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + "user")
  }
}
