import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from '../timeline/timeline.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TimelineComponent, HttpClientModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {}

  //暫停輪播
  isPlayStoped = false;
  playingSpeed = 3000;
  stopPlayPhoto(status: boolean) {
    // console.log(status)
    this.isPlayStoped = status;
  }
  //自動輪播
  autoPlayTimer: any = null;
  async ngAfterViewInit() {
    //取得相簿清單
    try {
      const res = await this.getTripData().toPromise();
      console.log(res);
      this.resetTimelineData(res as any[]);
    } catch (ex) {
      console.log(ex);
    }

    const trips = this.timelineData.filter((x) => x.type === 'trip');
    if (trips.length === 0) {
      console.log('無相簿');
      return;
    }
    this.changePhoto(0);
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPlayStoped) {
        const thisIndex = this.timelineData.findIndex(
          (x) => x.selected == true,
        );
        // console.log(thisIndex);
        if (this.preLoadefIndex < thisIndex) {
          return;
        }
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
  thisPhotoTitle = '';
  thisPhotoOwner = '';
  thisPhotoInfo = '';
  thisPhotoRef = '';
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
    if (this.photoOpacityTimeout != null) {
      window.clearTimeout(this.photoOpacityTimeout);
    }
    this.photoOpacityTimeout = setTimeout(() => {
      this.thisPhotoUrl =
        this.timelineData[id].img || 'assets/img/Background.jpg';
      this.thisPhotoTitle = this.timelineData[id].content;
      this.thisPhotoOwner = this.timelineData[id].owner;
      this.thisPhotoInfo = this.timelineData[id].note;
      this.thisPhotoRef = this.timelineData[id].link;
      this.isPhotoLeave = false;
      this.photoOpacityTimeout = null;
      this.checkVisibility();
    }, 500);
  }

  //偵測超出螢幕
  checkVisibility() {
    const selectedContainer = document.querySelector('.selected-container');
    if (selectedContainer) {
      const bounding = selectedContainer.getBoundingClientRect();
      if (
        bounding.top < 0 ||
        bounding.bottom >
          (window.innerHeight || document.documentElement.clientHeight) ||
        bounding.left < 0 ||
        bounding.right >
          (window.innerWidth || document.documentElement.clientWidth)
      ) {
        selectedContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }

  //手動點擊項目
  selectPhoto(id: number) {
    this.stopPlayPhoto(true);
    this.changePhoto(id);
  }

  //相簿集資料
  timelineData = [] as TripData[];

  getTripData() {
    return this.http.get(
      'https://travel-map-server.fly.dev/api/GoogleSheet/trips',
    );
  }

  resetTimelineData(newData: any[]) {
    this.timelineData = [];
    const years = [] as number[];
    //以日期倒排序
    const sortedData = newData
      .map((x) => ({ ...x, date: new Date(x.date) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    sortedData.forEach((data: any) => {
      const date = new Date(data.date);
      const year = date.getFullYear();
      if (!years.includes(year)) {
        years.push(year);
        const newYear = { date: year.toString(), type: 'year' } as TripData;
        this.timelineData.push(newYear);
      }

      const newTrip = {
        content: data.name,
        img: data.image,
        date: this.datePipe.transform(data.date.toString(), 'yyyy-MM-dd'),
        type: 'trip',
        note: data.note,
        link: data.link,
        owner: data.owner,
        selected: false,
      } as TripData;
      this.timelineData.push(newTrip);
    });
    this.preLoadImage(this.timelineData);
  }

  //預先載入圖片
  preLoadefIndex = -1;
  async preLoadImage(data: TripData[]) {
    if (data?.length > 0) {
      for (let i = 0; i < data.length; i++) {
        try {
          if (data[i].img) {
            await this.loadImage(data[i].img).toPromise();
          }
        } catch (e) {
          console.log(e);
        }
        this.preLoadefIndex = i;
      }
    }
  }

  loadImage(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}

interface TripData {
  content: string;
  date: string;
  type: 'year' | 'trip';
  selected: boolean;
  img: string;
  note: string;
  link: string;
  owner: string;
}
