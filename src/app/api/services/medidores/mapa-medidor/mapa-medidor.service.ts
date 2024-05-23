import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Medidores } from 'src/app/api/models/medidores/medidores';

@Injectable({
  providedIn: 'root',
})
export class MapaMedidorService {
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
      this.latitud = latitud;
      this.longitud = longitud;
      this.coordenada.latitud = latitud;
      this.coordenada.longitud = longitud;
      this.coords.emit(this.coordenada);
      console.log(lugar.coordenadas);

      if (this.ubicacion) {
        this.ubicacion.remove();
      }

      this.ubicacion = new mapboxgl.Marker({
        draggable: false,
        color: '#ffb503',
      })
        .setLngLat([longitud, latitud])
        .addTo(this.map);

      this.map.flyTo({
        center: [longitud, latitud],
        zoom: this.zoom,
        speed: 1.2,
        essential: true,
      });
    }
  }

  mostrarMedidor(medidor: Medidores): void {
    if (medidor.coordenadas) {
      const { latitud, longitud } = medidor.coordenadas;

      const limitesMapa = this.definirLimitesPorCoordenadas(latitud, longitud, 1);

      if (this.map) {
        this.map.setMaxBounds(limitesMapa);
        this.map.fitBounds(limitesMapa);
      }

      if (this.ubicacion) {
        this.ubicacion.remove();
      }

      const popupContent = `
        <div>
          <h5>${medidor.clientes.personas.nombre} ${medidor.clientes.personas.ap} ${medidor.clientes.personas.am}</h5>
          <p>Tipo: ${medidor.tipo_med}</p>
          <p>Estado: ${medidor.estado}</p>
        </div>
      `;

      this.ubicacion = new mapboxgl.Marker()
        .setLngLat([longitud, latitud])
        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
        .addTo(this.map);

      this.map.flyTo({
        center: [longitud, latitud],
        zoom: 18,
        speed: 0.5,
        essential: true,
      });
    }
  }

  cambiarEstilo(estilo: string) {
    this.map.setStyle(estilo);
  }

  modificar(coordenada: Coordenadas) {
    if (this.map) {
      this.map.setCenter([coordenada.longitud, coordenada.latitud]);
    } else {
      console.error('El mapa no se ha inicializado.');
    }
  }

  definirLimitesPorCoordenadas(
    latitud: number,
    longitud: number,
    radio: number
  ): mapboxgl.LngLatBoundsLike {
    const limiteSuperior = latitud + radio / 111.32;
    const limiteInferior = latitud - radio / 111.32;
    const limiteIzquierdo =
      longitud - radio / (111.32 * Math.cos(latitud * (Math.PI / 180)));
    const limiteDerecho =
      longitud + radio / (111.32 * Math.cos(latitud * (Math.PI / 180)));

    return [
      [limiteIzquierdo, limiteInferior],
      [limiteDerecho, limiteSuperior],
    ];
  }
}
