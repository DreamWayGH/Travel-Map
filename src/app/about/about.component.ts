import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  aboutData = [
    '軟體工程師',
    '三年網頁全端開發',
    '過去一年勝任5人的開發團隊領導職務',
  ];
  skillData =[
    'Front-end： Vue3 / JavaScript / TypeScript / html / scss / Three.js',
    'Back-end： ASP.NET 6 / C# / Entity Framework',
    'Communication： HTTP / MQTT / WebSocket / Modbus',
    'Streaming： RTSP / OpenCV / WebRTC',
    'Other： IIS / nginx / Git / SVN / AWS / Raspberry Pi'
  ]
  expData=[
    '研發工程師 - 天茶智能科技 May 2020 - Dec 2023',
    '混合實境開發 - 成功大學土木所 Jun. 2017 - Jul. 2019',
    'M.S. Civil Engineering, National Cheng Kung University, 2017 - 2019',
    'B.S. Civil Engineering, National Chung Hsing University, 2013 - 2017',
  ]
}
