import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Data } from '../models/data.model';
import * as d3 from 'd3';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges, OnDestroy {
  message: string;
  subscription: Subscription;

  @ViewChild('barChart')
  private chartContainer!: ElementRef;

  @Input()
  data: Data[];

  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  sortingMessage: string;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.currentMessage.subscribe((message) => {
      if (!this.data) return;
      else if (message === 'Ascending') {
        this.data.sort((a, b) => d3.ascending(a.frequency, b.frequency));
      } else if (message === 'Descending') {
        this.data.sort((a, b) => d3.descending(a.frequency, b.frequency));
      } else if (message === 'Default') {
        this.data.sort((a, b) => d3.ascending(a.letter, b.letter));
      }

      this.createChart();
    });
  }

  ngOnChanges(): void {
    if (!this.data) return;

    this.createChart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private createChart() {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth =
      element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight =
      element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data?.map((d) => d.letter));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, (d) => d.frequency)]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10, '%'))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d?.letter))
      .attr('y', (d) => y(d?.frequency))
      .transition()
      .duration(1000)
      .attr('width', x?.bandwidth())
      .attr('height', (d) => contentHeight - y(d?.frequency));
  }

  onResize() {
    this.createChart();
  }
}
