import { Component, OnInit } from "@angular/core";
import { DataserviceService } from "src/app/services/dataservice.service";
import { GlobalDataSummary } from "src/app/models/global-data";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  datatable = [];
  chart = {
    PieChart: "PieChart",
    ColumnChart: "ColumnChart",
    LineChart: "LineChart",
    height: 500,
    options: {
      Country: "Cases",
      animation: {
        duration: 1000,
        easing: "out",
      },
      is3D: true,
    },
  };
  loading = true;

  constructor(private dataService: DataserviceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;

        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });
        this.initChart("c");
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    // this.datatable.push(["Country", "Cases"]);
    this.datatable = [];
    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType === "c") {
        if (cs.confirmed > 4000) {
          value = cs.confirmed;
        }
      }

      if (caseType === "a") {
        if (cs.active > 1000) {
          value = cs.active;
        }
      }

      if (caseType === "r") {
        if (cs.recovered > 1000) {
          value = cs.recovered;
        }
      }

      if (caseType === "d") {
        if (cs.deaths > 500) {
          value = cs.deaths;
        }
      }

      this.datatable.push([cs.country, value]);
    });
    console.log(this.datatable);
  }
}
