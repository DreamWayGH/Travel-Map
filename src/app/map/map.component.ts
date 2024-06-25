import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
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
  markers = [] as any[];

  async ngAfterViewInit() {
    //取得相簿清單
    try {
      const res = await this.getTripData().toPromise();
      console.log(res);
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
      return {
        position: {
          lat: Number(locs[0] ?? this.def_lat),
          lng: Number(locs[1] ?? this.def_lng),
        },
        title: x.name,
        label: x.name.split('')[0],
        options: { animation: google.maps.Animation.DROP },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#f7a110',
          fillOpacity: 1,
          strokeColor: '#666',
          strokeWeight: 1,
          scale: 15
        }
      };
    });
    console.log(this.markers);
  }
}
