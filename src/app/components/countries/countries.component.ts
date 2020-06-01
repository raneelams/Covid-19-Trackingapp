import { Component, OnInit } from "@angular/core";
import { DataserviceService } from "src/app/services/dataservice.service";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DateWiseData } from "src/app/models/date-wise-data";
import { merge } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-countries",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.css"],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  dateWiseData;
  loading = true;
  selectedCountryData: DateWiseData[];
  chart = {
    LineChart: "LineChart",
    options: {
      height: 500,
      animation: {
        duration: 1000,
        easing: "out",
      },
    },
  };

  constructor(private service: DataserviceService) {}

  ngOnInit(): void {
    merge(
      this.service.getdateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      // this.service.getGlobalData().pipe(
      //   map((result) => {
      //     this.data = result;
      //     this.data.forEach((cs) => {
      //       this.countries.push(cs.country);
      //     });
      //   })
      // )
      this.service.getGlobalData().subscribe((result) => {
        this.data = result;
        this.data.forEach((cs) => {
          this.countries.push(cs.country);
        });
      })
    ).subscribe({
      complete: () => {
        this.updateValues("India");
        this.selectedCountryData = this.dateWiseData["India"];
        this.updateChart();
        this.loading = false;
      },
    });
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(["Date", "Cases"]);
    this.selectedCountryData.forEach((cs) => {
      dataTable.push([cs.date, cs.cases]);
    });

    // this.lineChart = {
    //   chartType: "LineChat",
    //   dataTable: dataTable,
    //   options: {
    //     height: 500,
    // },
    // };
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach((cs) => {
      if (cs.country === country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalRecovered = cs.recovered;
        this.totalDeaths = cs.deaths;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
    this.updateChart();
  }
}
