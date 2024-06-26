import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import MarkerClusterer from '@google/markerclustererplus';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    GoogleMapsModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(private http: HttpClient) {}

  def_lat = 23.68348;
  def_lng = 121.025572;
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
    zoom: 8,
    center: {
      lat: this.def_lat,
      lng: this.def_lng,
    },
    mapTypeControl: false,
    streetViewControl: false,
  };
  markers: google.maps.Marker[] = [];
  infoWindow = new google.maps.InfoWindow();
  markerClusterer: MarkerClusterer | null = null;
  markerRawData: TripData[] = [];
  markerFilterData: TripData[] = [];

  markerTypes: IKey[] = [];
  selectedTypes: string[] = [];
  markerOwners: IKey[] = [];
  selectedOwners: string[] = [];
  markerMembers: IKey[] = [];
  selectedMembers: string[] = [];

  async ngAfterViewInit() {
    //取得相簿清單
    try {
      const res = await this.getTripData().toPromise();
      this.markerRawData = res?.map((x, i) => ({ ...x, sequence: i })) ?? [];
      console.log(this.markerRawData);
      this.updateFilteredData();
      this.resetMarkers(res as any[]);
    } catch (ex) {
      console.log(ex);
    }
  }

  getTripData() {
    return this.http.get<TripData[]>(
      'https://travel-map-server.fly.dev/api/GoogleSheet/trips',
    );
  }

  resetMarkers(data: TripData[]) {
    if (this.markers) {
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
    }

    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
      this.markerClusterer = null;
    }

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

    this.markerClusterer = new MarkerClusterer(
      this.map.googleMap!,
      this.markers,
      {
        // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
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
      },
    );
    this.markers.forEach((marker, i) => {
      const info = data[i];
      const owners = info.owner
        ? info.owner
            .split(',')
            .map((x: string) => {
              return `<div class='owner'>${x}</div>`;
            })
            .join('')
        : '';
      const members = info.member
        ? info.member
            .split(',')
            .map((x: string) => {
              return `<div class='member'>${x}</div>`;
            })
            .join('')
        : '';
      const notes = info.note ? `<p>${info.note}</p>` : '';
      marker.addListener('click', () => {
        this.infoWindow.setContent(`
          <div class='info-window'>
            <h2>${info.name}</h2>
             <a href="${info.image}" target="_blank">
              <img src="${info.image}"/>
            </a>
            <div class='member-wrap'>${owners}${members}</div>
            ${notes}
            <a href='${info.link ?? ''}' target="_blank">${info.link ?? ''}</a>
          </div>
        `);
        this.infoWindow.open(this.map.googleMap, marker);
      });
      this.map.googleMap?.addListener('click', () => {
        this.infoWindow?.close();
      });
    });
  }

  updateFilteredData() {
    const applyFilter = (
      data: TripData[],
      selectedItems: string[],
      key: keyof TripData,
    ) => {
      return selectedItems.length > 0
        ? data.filter((x) => {
            const value = x[key] as string;
            const valueItems = value.split(',');
            return selectedItems.every((item) => valueItems.includes(item));
          })
        : data;
    };

    let newData: TripData[] = this.markerRawData.map((x) => {
      return {
        ...x,
        allMember: x.owner === '--' ? x.member : `${x.owner},${x.member}`,
      };
    });
    newData = applyFilter(newData, this.selectedTypes, 'type');
    newData = applyFilter(newData, this.selectedOwners, 'owner');
    newData = applyFilter(newData, this.selectedMembers, 'allMember');

    const getUniqueValues = (data: TripData[], key: keyof TripData) => {
      const valueCounts = new Map<string, number>();

      data.forEach((item) => {
        const values = (item[key] as unknown as string).split(',');
        values.forEach((value) => {
          if (valueCounts.has(value)) {
            valueCounts.set(value, valueCounts.get(value)! + 1);
          } else {
            valueCounts.set(value, 1);
          }
        });
      });

      return [...valueCounts.entries()].sort().map(([value, count]) => {
        return { label: `${value} (${count})`, value: value } as IKey;
      });
    };

    this.markerTypes = getUniqueValues(newData, 'type');
    this.markerOwners = getUniqueValues(newData, 'owner');
    this.markerMembers = getUniqueValues(newData, 'allMember');

    this.resetMarkers(newData);
  }
}

interface TripData {
  code: string;
  name: string;
  date: string;
  note: string;
  image: string;
  location: string;
  type: string;
  owner: string;
  member: string;
  allMember: string;
  link: string;
}

interface IKey {
  label: string;
  value: string;
}
