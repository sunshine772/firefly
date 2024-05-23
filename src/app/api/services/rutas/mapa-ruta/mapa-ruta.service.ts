import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Coordenadas } from 'src/app/api/models/coordenadas/coordenadas';
import { Lugares } from 'src/app/api/models/lugares/lugares';
import { Medidores } from 'src/app/api/models/medidores/medidores';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapaRutaService {
  private coordenada = new Coordenadas();

  rutaActualizada = new EventEmitter<Coordenadas[]>();

  mapbox = mapboxgl as typeof mapboxgl;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/sunshine772/cl979ypfr001414m9bcpwclzn';
  longitud = -65.20829922024751;
  latitud = -20.64170007290781;
  zoom = 14;
  minZoom = 12;

  constructor(private http: HttpClient) {
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

  mostrarLugar(lugar: Lugares): void {
    this.map.flyTo({
      center: [lugar.coordenadas.longitud, lugar.coordenadas.latitud],
      zoom: this.zoom,
      speed: 1.2,
      essential: true,
    });
  }

  agregarRuta() {
    const rutaPoints: Coordenadas[] = [];

    this.map.on('click', (event) => {
      const lngLat = event.lngLat;

      // Actualiza las propiedades de longitud y latitud en la instancia existente
      this.coordenada.longitud = lngLat.lng;
      this.coordenada.latitud = lngLat.lat;

      // Crea una copia de this.coordenada para agregarla a rutaPoints
      const nuevaCoordenada: Coordenadas = { ...this.coordenada };

      // Agrega la nueva coordenada a la ruta
      rutaPoints.push(nuevaCoordenada);

      const rutaGeojson: any = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: rutaPoints.map((coord) => [
            coord.longitud,
            coord.latitud,
          ]),
        },
      };

      const rutaSource = this.map.getSource('ruta') as mapboxgl.GeoJSONSource;

      if (rutaSource) {
        rutaSource.setData(rutaGeojson);
      } else {
        this.map.addSource('ruta', {
          type: 'geojson',
          data: rutaGeojson,
        });

        this.map.addLayer({
          id: 'ruta',
          type: 'line',
          source: 'ruta',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#ffb503',
            'line-width': 8,
          },
        });
      }

      this.rutaActualizada.emit(rutaPoints);
    });
  }

  obtenerRutaMasCortaEntrePuntos(medidores: Medidores[]) {
    const coordinates = this.generarCoordenadas(medidores);
    coordinates.forEach((coord, index) => {
      const [lng, lat] = coord.split(',').map(Number);
      const medidor = medidores[index];

      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);

      const nombre = `${medidor.clientes.personas.nombre}`;
      const ap = ` ${medidor.clientes.personas.ap}`;
      const am = medidor.clientes.personas.am
        ? ` ${medidor.clientes.personas.am}`
        : '';
      const dueño = `Dueño: ${nombre}${ap}${am}`;
      const tipo_med = this.transformRequestType(medidor.tipo_med);
      const popupContent = `
          <div class="custom-popup-content">
            <p>ID: ${medidor.id_med}</p>
            <p>${dueño}</p>
            <p>Tipo: ${tipo_med.translation}</p>
          </div>
        `;

      marker.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent));
    });

    this.map.on('load', () => {
      this.obtenerRutasEntrePuntos(coordinates, 0);
    });
  }

  private obtenerRutasEntrePuntos(coordinates: string[], index: number) {
    if (index >= coordinates.length - 1) {
      return;
    }

    const startPoint = coordinates[index];
    const endPoint = coordinates[index + 1];

    const url = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/`,
      `${startPoint};${endPoint}`,
      `?steps=true&geometries=geojson&access_token=${environment.mapbox.accessToken}`,
    ].join('');

    this.http.get(url).subscribe((res: any) => {
      const data = res.routes[0];
      const route = data.geometry.coordinates;

      this.map.addSource(`route-${index}-${index + 1}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      });

      this.map.addLayer({
        id: `route-${index}-${index + 1}`,
        type: 'line',
        source: `route-${index}-${index + 1}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'red',
          'line-width': 5,
        },
      });

      this.obtenerRutasEntrePuntos(coordinates, index + 1);
    });
  }

  private generarCoordenadas(medidores: Medidores[]): string[] {
    return medidores.map(
      (medidor) =>
        `${medidor.coordenadas.longitud},${medidor.coordenadas.latitud}`
    );
  }

  cambiarEstilo(estilo: string) {
    this.map.setStyle(estilo);
  }

  transformRequestType(requestType: string): {
    translation: string;
    icon: string;
  } {
    switch (requestType) {
      case 'D':
        return { translation: 'Domiciliario', icon: 'pi pi-home' };
      case 'G':
        return { translation: 'General', icon: 'pi pi-building' };
      case 'I':
        return { translation: 'Industrial', icon: '' };
      default:
        return { translation: requestType, icon: '' };
    }
  }
}
