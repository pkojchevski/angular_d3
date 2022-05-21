import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  selectionData = [
    { id: 1, name: 'Default' },
    { id: 2, name: 'Ascending' },
    { id: 3, name: 'Descending' },
  ];

  sortingEvent: EventEmitter<any> = new EventEmitter();

  selectedValue: string = 'Default';
  selectionForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.selectionForm = this.fb.group({
      selection: ['Default'],
    });
  }

  sorting() {
    this.dataService.changeMessage(this.selection);
  }

  get selection(): string {
    return this.selectionForm.get('selection').value;
  }
}
