import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  @Input() timelineData: any;
  @Output() selectPhoto = new EventEmitter<number>();
  @Output() stopPlayPhoto = new EventEmitter<boolean>();
}
