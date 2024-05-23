import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapaLugarService {
  private coordenada = new Coordenadas();
  @Output() coords: EventEmitter<Coordenadas> = new EventEmitter();

  marker!: mapboxgl.Marker;
  coordinates: number[][] = [];

  mapbox = mapboxgl as typeof mapboxgl;
  map!: mapboxgl.Map;

  puntos: any;
  popup: any;
  ubicacion: any;
  style = 'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn';

  longitud = -65.20829922024751;
  latitud = -20.64170007290781;
  zoom = 14;
  minZoom = 12;

  constructor(private httpClient: HttpClient) {
    this.mapbox.accessToken = environment.mapbox.accessToken;
  }

  puntero$!: any;

  buildMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          center: [this.longitud, this.latitud],
          zoom: this.zoom,
          minZoom: this.minZoom,
          attributionControl: false,
        });

        this.map.on('load', () => {
          this.map.resize();
        });

        resolve({
          map: this.map,
        });
      } catch (error) {
        reject(error);
      }
    }).then(() => {
      this.puntero();
    });
  }

  puntero() {
    this.puntero$ = new this.mapbox.Marker({
      color: '#FF0000',
      draggable: false,
    });

    this.puntero$.setLngLat([this.longitud, this.latitud]).addTo(this.map);

    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.puntero$.setLngLat(center);

      this.latitud = center.lat;
      this.longitud = center.lng;
      this.coordenada.latitud = this.latitud;
      this.coordenada.longitud = this.longitud;
      this.coords.emit(this.coordenada);
    });
  }

  adicionar() {
    this.map.on('click', (e) => {
      if (this.ubicacion) {
        this.ubicacion.remove();
      }

      this.latitud = e.lngLat.wrap().lat;
      this.longitud = e.lngLat.wrap().lng;
      this.coordenada.latitud = this.latitud;
      this.coordenada.longitud = this.longitud;
      this.coords.emit(this.coordenada);

      this.ubicacion = new mapboxgl.Marker({
        draggable: false,
        color: '#ffb503',
      })
        .setLngLat([this.longitud, this.latitud])
        .addTo(this.map);
    });
  }

  mostrarLugar(lugar: Lugares): void {
    if (lugar.coordenadas) {
      const { latitud, longitud } = lugar.coordenadas;

      if (this.ubicacion) {
        this.ubicacion.remove();
      }

      // const popupContent = `
      //   <div>
      //     <h5>${medidor.clientes.personas.nombre} ${medidor.clientes.personas.ap} ${medidor.clientes.personas.am}</h5>
      //     <p>Tipo: ${medidor.tipo_med}</p>
      //     <p>Estado: ${medidor.estado}</p>
      //   </div>
      // `;

      this.ubicacion = new mapboxgl.Marker()
        .setLngLat([longitud, latitud])
        .addTo(this.map);

      this.map.flyTo({
        center: [longitud, latitud],
        zoom: 15,
        speed: 0.5,
        essential: true,
      });
    }
  }

  cambiarEstilo(estilo: string) {
    this.map.setStyle(estilo);
  }

  modificar(lugar: Lugares) {
    if (this.map) {
      this.map.setCenter([lugar.coordenadas.longitud, lugar.coordenadas.latitud]);
    } else {
      console.error('El mapa no se ha inicializado.');
    }
  }
}
