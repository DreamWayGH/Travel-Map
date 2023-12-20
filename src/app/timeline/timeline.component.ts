import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  timelineData = [
    { content: '', date: '2023', type: 'year' },
    {
      content: '陽明山陽明山陽明山陽明山陽明山',
      date: '2023-12-21',
      type: 'event',
    },
    { content: '玉山主峰', date: '2023-12-02', type: 'event' },
    { content: '大霸尖山', date: '2023-11-21', type: 'event' },
    { content: '奇萊南峰', date: '2023-11-02', type: 'event' },
    {
      content:
        '雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰',
      date: '2023-10-01',
      type: 'event',
    },
    { content: '玉山主峰', date: '2023-12-02', type: 'event' },
    { content: '大霸尖山', date: '2023-11-21', type: 'event' },
    {
      content:
        '奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰',
      date: '2023-11-02',
      type: 'event',
    },
    { content: '雪山北峰', date: '2023-10-01', type: 'event' },
    { content: '玉山主峰', date: '2023-12-02', type: 'event' },
    { content: '大霸尖山', date: '2023-11-21', type: 'event' },
    { content: '', date: '2022', type: 'year' },
    { content: '奇萊南峰', date: '2023-11-02', type: 'event' },
    { content: '雪山北峰', date: '2023-10-01', type: 'event' },
    { content: '玉山主峰', date: '2023-12-02', type: 'event' },
    { content: '大霸尖山', date: '2023-11-21', type: 'event' },
    { content: '奇萊南峰', date: '2023-11-02', type: 'event' },
    { content: '雪山北峰', date: '2023-10-01', type: 'event' },
  ];
}
