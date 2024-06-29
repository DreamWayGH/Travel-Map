import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import MarkerClusterer from '@google/markerclustererplus';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(private http: HttpClient) {}

  def_lat = 23.68348;
  def_lng = 121.025572;
  center: google.maps.LatLngLiteral = {
    lat: this.def_lat,
    lng: this.def_lng,
  };
  zoom = 8;
  mapOptions = {
    styles: [
      {
        featureType: 'landscape',
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 60,
          },
        ],
      },
      {
        featureType: 'road.local',
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 40,
          },
          {
            visibility: 'on',
          },
        ],
      },
      {
        featureType: 'transit',
        stylers: [
          {
            saturation: -100,
          },
          {
            visibility: 'simplified',
          },
        ],
      },
      {
        featureType: 'administrative.province',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'water',
        stylers: [
          {
            visibility: 'on',
          },
          {
            lightness: 30,
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#ef8c25',
          },
          {
            lightness: 40,
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#b6c54c',
          },
          {
            lightness: 40,
          },
          {
            saturation: -40,
          },
        ],
      },
    ],
  };
  markers: google.maps.Marker[] = [];
  markerRawData: any;

  async ngAfterViewInit() {
    //取得相簿清單
    try {
      const res = await this.getTripData().toPromise();
      this.markerRawData = res;
      console.log(this.markerRawData);
      this.resetMarkers(res as any[]);
    } catch (ex) {
      console.log(ex);
    }
  }

  getTripData() {
    return this.http.get(
      'https://travel-map-server.fly.dev/api/GoogleSheet/trips',
    );
  }

  resetMarkers(data: any[]) {
    this.markers = data?.map((x) => {
      const locs = x.location?.split(',');
      return new google.maps.Marker({
        position: {
          lat: Number(locs[0] ?? this.def_lat),
          lng: Number(locs[1] ?? this.def_lng),
        },
        title: x.name,
        label: {
          text: x.code,
          color: '#25331b',
          fontWeight: 'bold',
        },
        icon: {
          url: 'assets/img/marker/m0.png',
          scaledSize: new google.maps.Size(50, 50),
        },
        animation: google.maps.Animation.DROP,
      });
    });
    console.log(this.markers);
    new MarkerClusterer(this.map.googleMap!, this.markers, {
      // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      clusterClass: 'aaa',
      styles: [
        {
          url: `assets/img/marker/m1.png`,
          height: 50,
          width: 50,
          anchorText: [15, -2],
          textColor: '#000',
          textSize: 16,
        },
      ],
    });
    this.markers.forEach((marker, i) => {
      console.log(this.markerRawData[i]);
      const owners = this.markerRawData[i].owner
        ? `<div class='owner-wrap'>${this.markerRawData[i].owner}</div>`
        : '';
      marker.addListener('click', () => {
        this.infoWindow.setContent(`
          <div class='info-window'>
            <h2>${this.markerRawData[i].name}</h2>
             <a href="${this.markerRawData[i].image}" target="_blank">
              <img src="${this.markerRawData[i].image}"/>
            </a>
            <div class='marker-info'>
              ${owners}
              <p>${this.markerRawData[i].note}</p>
            </div>
            <a href='${this.markerRawData[i].link ?? ''}' target="_blank">${
              this.markerRawData[i].link ?? ''
            }</a>
          </div>
        `);
        this.infoWindow.open(this.map.googleMap, marker);
      });
    });
  }
  infoWindow = new google.maps.InfoWindow();
}
