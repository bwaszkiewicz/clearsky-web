import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '../models/Data';
import { Measurments } from '../models/Measurments';
import { Globals } from 'src/shared/services/globals.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  getAllP10Measurement() {
    return this.http.get<Measurments>(Globals.API_URL + `/fields/1.json?api_key=I2HBGAJULLCCRRYY`);
  }

  getAllP25Measurement() {
    return this.http.get<Measurments>(Globals.API_URL + `/fields/2.json?api_key=I2HBGAJULLCCRRYY`);
  }

  getAllMeasurment(){
    return this.http.get<Measurments>(Globals.API_URL + `/feeds.json?api_key=I2HBGAJULLCCRRYY`);
  }

  getLastMeasurment(): Observable<any> {
    return this.http.get(Globals.API_URL + `/feeds.json?api_key=I2HBGAJULLCCRRYY&results=1`);
  }

  getNumberOfMeasurments(start: string, end: string): Observable<any> {
    return this.http.get(Globals.API_URL + `/feeds.json?api_key=I2HBGAJULLCCRRYY&start=${start}&end=${end}`);
  }

  getAvarangeMeasurmentsOfDay(start: string, end: string): Observable<any> {
    return this.http.get(Globals.API_URL + `/feeds.json?api_key=I2HBGAJULLCCRRYY&average=daily&start=${start}&end=${end}`);
  }

}
