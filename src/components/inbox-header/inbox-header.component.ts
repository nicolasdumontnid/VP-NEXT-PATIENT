import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inbox-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox-header.component.html',
  styleUrl: './inbox-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxHeaderComponent {
  @Input() resultsFound: number = 0;
  @Output() sortToggle = new EventEmitter<void>();

  toggleSort() {
    this.sortToggle.emit();
  }
}