import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../services/statistics.service';
import { Data } from '../models/Data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public AqiPM10 = -1;
  public AqiPM10Str: string;
  public AqiPM25 = -1;
  public AqiPM25Str: string;
  public lastUpdate: Date = new Date();
  public lastUpdateStr;

  private MIN_MEASURMENTS = 100;

  public dataInternal = new Data();
  constructor(private statisticsService: StatisticsService,
              private datepipe: DatePipe) { }

  ngOnInit() {
    this.getLastUpdate();
    this.checkAqi();

    setInterval(() => {this.getLastUpdate(); }, 5000);
    setInterval(() => {this.checkAqi(); }, 5 * 60 * 1000);
  }

  getLastUpdate() {
    this.statisticsService.getLastMeasurment().subscribe((res) => {
      let feeds = res['feeds'];
      let feed = feeds[0];
      this.lastUpdate = new Date(feed['created_at']);

      this.lastUpdateStr = this.datepipe.transform(this.lastUpdate, 'yyyy-MM-dd HH:mm:ss');
    });
  }

  checkAqi() {
    var currentDate = new Date();
    let currentDateStr = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    let startDateStr = currentDateStr + '%2000:00:01';
    let endDateStr = currentDateStr + '%2023:59:59';
    let feeds;
    this.statisticsService.getNumberOfMeasurments(startDateStr, endDateStr).subscribe((res) => {
       feeds = res['feeds'];
       console.log(feeds);

       if (feeds.length > this.MIN_MEASURMENTS) {

        // TODAY
        this.calculateAqi(startDateStr, endDateStr);

      } else {
        currentDate.setDate(currentDate.getDate() - 1);
        currentDateStr = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
        startDateStr = currentDateStr + '%2000:00:01';
        endDateStr = currentDateStr + '%2023:59:59';
        this.statisticsService.getNumberOfMeasurments(startDateStr, endDateStr).subscribe((res) => {
          feeds = res['feeds'];
          if (feeds.length > this.MIN_MEASURMENTS) {

            // YESTERDAY
            this.calculateAqi(startDateStr, endDateStr);
          } else {
            this.AqiPM10 = -1;
            this.AqiPM10Str = 'Unknown';
            this.AqiPM25 = -1;
            this.AqiPM25Str = 'Unknown';
          }
        });
      }
    });



  }

  calculateAqi(start: string, end: string) {
    this.statisticsService.getAvarangeMeasurmentsOfDay(start, end).subscribe((res) => {
      let feeds = res['feeds'];
      let feed = feeds[0];
      this.AqiPM10 = feed['field1'];
      this.AqiPM25 = feed['field2'];
    });

    if (this.AqiPM10 < 20) {
      this.AqiPM10Str = 'Excelent';
    } else if (this.AqiPM10 < 60) {
      this.AqiPM10Str = 'Good';
    } else if (this.AqiPM10 < 100) {
      this.AqiPM10Str = 'ACCEPTABLE';
    } else if (this.AqiPM10 < 140) {
      this.AqiPM10Str = 'MODERATE';
    } else if (this.AqiPM10 < 200) {
      this.AqiPM10Str = 'HEAVY';
    } else if (this.AqiPM10 > 200) {
      this.AqiPM10Str = 'HAZARDOUS';
    }

    if (this.AqiPM25 < 12) {
      this.AqiPM25Str = 'Excelent';
    } else if (this.AqiPM25 < 36) {
      this.AqiPM25Str = 'Good';
    } else if (this.AqiPM25 < 60) {
      this.AqiPM25Str = 'ACCEPTABLE';
    } else if (this.AqiPM25 < 84) {
      this.AqiPM25Str = 'MODERATE';
    } else if (this.AqiPM25 < 120) {
      this.AqiPM25Str = 'HEAVY';
    } else if (this.AqiPM25 > 120) {
      this.AqiPM25Str = 'HAZARDOUS';
    }

  }

  showDialog() {

  }



}
