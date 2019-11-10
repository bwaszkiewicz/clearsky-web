import { Component, OnInit } from '@angular/core';
import { Measurments } from '../../models/Measurments.js';
import { StatisticsService } from '../../services/statistics.service.js';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartPM10 = [];
  chartPM25 = [];
  dates = [];
  pm10 = [];
  pm25 = [];

  constructor(private statisticsService: StatisticsService,
              private datepipe: DatePipe) { }

  ngOnInit() {
    this.statisticsService.getAllMeasurment().subscribe((res: Measurments) => {
      this.dates = res['feeds'].map(res => res.created_at);
      this.pm10 = res['feeds'].map(res => res.field1);
      this.pm25 = res['feeds'].map(res => res.field2);

      this.showPM10Chart();
      this.showPM25Chart();
     });
  }

  getPM10DataPoints() {
    this.statisticsService.getAllP10Measurement().subscribe((res: Measurments) => {
      this.dates = res['feeds'].map(res => res.created_at);
      this.pm10 = res['feeds'].map(res => res.field1);

      this.showPM10Chart();
     });
  }

  getPM25DataPoints(){
    this.statisticsService.getAllP10Measurement().subscribe((res: Measurments) => {
      this.dates = res['feeds'].map(res => res.created_at);
      this.pm10 = res['feeds'].map(res => res.field1);

      this.showPM25Chart();
     });
  }

  showPM10Chart() {
     this.chartPM10 = new Chart('canvasPM10', {
       type: 'line',
       data: {
        labels: this.dates,
        datasets: [
          {
            data: this.pm10,
            borderColor: '#3cba9f',
            fill: false
          }
        ]
       },
       options: {
         legend: {
           display: false
         },
         title: {
          display: true,
          text: 'Concentration PM10'
        },
         scales: {
           xAxes: [{
             display: true,
             scaleLabel: {
              display: true,
              labelString: 'Date'
             }
           }],
           yAxes: [{
             display: true,
             scaleLabel: {
              display: true,
              labelString: 'µg/m3'
             }
           }]
         }
       }
     });
    }

    showPM25Chart(){
      this.chartPM25 = new Chart('canvasPM25', {
        type: 'line',
        data: {
         labels: this.dates,
         datasets: [
           {
             data: this.pm25,
             borderColor: '#3cff9f',
             fill: false
           }
         ]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Concentration PM25'
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
               display: true,
               labelString: 'Date',
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
               display: true,
               labelString: 'µg/m3'
              }
            }]
          }
        }
      });
    }
}
