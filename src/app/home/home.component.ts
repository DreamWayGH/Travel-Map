import { Component } from '@angular/core';
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  //暫停輪播
  isPlayStoped = false;
  playingSpeed = 3000;
  stopPlayPhoto(status: boolean) {
    this.isPlayStoped = status;
  }
  //自動輪播
  autoPlayTimer: any = null;
  ngAfterViewInit() {
    this.changePhoto(0);
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPlayStoped) {
        const thisIndex = this.timelineData.findIndex(
          (x) => x.selected == true,
        );
        // console.log(thisIndex);
        if (thisIndex < this.timelineData.length - 1) {
          this.changePhoto(thisIndex + 1);
        } else {
          this.changePhoto(0);
        }
      }
    }, this.playingSpeed);
  }
  ngOnDestroy() {
    if (this.autoPlayTimer != null) {
      window.clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  //更換照片
  thisPhotoUrl = '';
  isPhotoLeave = true;
  photoOpacityTimeout: any = null;
  changePhoto(id: number) {
    this.timelineData = this.timelineData.map((item) => ({
      ...item,
      selected: false,
    }));
    if (this.timelineData[id].type == 'year') {
      if (id < this.timelineData.length - 1) {
        this.changePhoto(id + 1);
      } else {
        this.changePhoto(0);
      }
      return;
    }
    this.timelineData[id].selected = true;
    this.isPhotoLeave = true;
    if(this.photoOpacityTimeout != null){
      window.clearTimeout(this.photoOpacityTimeout)
    }
    this.photoOpacityTimeout = setTimeout(() => {
      this.thisPhotoUrl =
        this.timelineData[id].img || 'assets/img/Background.jpg';
      this.isPhotoLeave = false;
      this.photoOpacityTimeout = null;
    }, 500);
  }
  //手動點擊項目
  selectPhoto(id: number) {
    this.stopPlayPhoto(true);
    this.changePhoto(id);
  }

  timelineData = [
    { content: '', date: '2023', type: 'year', selected: false, img: '' },
    {
      content: '陽明山陽明山陽明山陽明山陽明山',
      date: '2023-12-21',
      type: 'event',
      selected: false,
      img: 'assets/img/Icon.png',
    },
    {
      content: '玉山主峰',
      date: '2023-12-02',
      type: 'event',
      selected: false,
      img: 'assets/img/Background.jpg',
    },
    {
      content: '大霸尖山',
      date: '2023-11-21',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeInvisibleOutlined.svg',
    },
    {
      content: '奇萊南峰',
      date: '2023-11-02',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeOutline.svg',
    },
    {
      content:
        '雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰雪山北峰',
      date: '2023-10-01',
      type: 'event',
      selected: false,
      img: 'assets/img/LockOpen.svg',
    },
    {
      content: '玉山主峰',
      date: '2023-12-02',
      type: 'event',
      selected: false,
      img: 'assets/img/People.svg',
    },
    {
      content: '大霸尖山',
      date: '2023-11-21',
      type: 'event',
      selected: false,
      img: 'assets/img/Icon.png',
    },
    {
      content:
        '奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰奇萊南峰',
      date: '2023-11-02',
      type: 'event',
      selected: false,
      img: 'assets/img/Background.jpg',
    },
    {
      content: '雪山北峰',
      date: '2023-10-01',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeInvisibleOutlined.svg',
    },
    {
      content: '玉山主峰',
      date: '2023-12-02',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeOutline.svg',
    },
    {
      content: '大霸尖山',
      date: '2023-11-21',
      type: 'event',
      selected: false,
      img: 'assets/img/LockOpen.svg',
    },
    {
      content: '',
      date: '2022',
      type: 'year',
      selected: false,
      img: 'assets/img/People.svg',
    },
    {
      content: '奇萊南峰',
      date: '2023-11-02',
      type: 'event',
      selected: false,
      img: 'assets/img/Icon.png',
    },
    {
      content: '雪山北峰',
      date: '2023-10-01',
      type: 'event',
      selected: false,
      img: 'assets/img/Background.jpg',
    },
    {
      content: '玉山主峰',
      date: '2023-12-02',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeInvisibleOutlined.svg',
    },
    {
      content: '大霸尖山',
      date: '2023-11-21',
      type: 'event',
      selected: false,
      img: 'assets/img/EyeOutline.svg',
    },
    {
      content: '奇萊南峰',
      date: '2023-11-02',
      type: 'event',
      selected: false,
      img: 'assets/img/LockOpen.svg',
    },
    {
      content: '雪山北峰',
      date: '2023-10-01',
      type: 'event',
      selected: false,
      img: 'assets/img/People.svg',
    },
  ];
}
