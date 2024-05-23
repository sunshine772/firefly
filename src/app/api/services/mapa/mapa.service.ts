import { EventEmitter, Injectable, Output } from '@angular/core';
import { Coordenadas } from '../../models/coordenadas/coordenadas';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Lugares } from '../../models/lugares/lugares';
import { Postes } from '../../models/postes/postes';
import { Lineas } from '../../models/lineas/lineas';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {
  private coordenada = new Coordenadas();
  @Output() coords: EventEmitter<Coordenadas> = new EventEmitter();

  // Otra forma de extraer las coordenadas del click
  private coordenadasSubject = new BehaviorSubject<Coordenadas | null>(null);

  marker!: mapboxgl.Marker;
  coordinates: number[][] = [];

  mapbox = mapboxgl as typeof mapboxgl;
  map!: mapboxgl.Map;

  puntos: any;
  popup: any;
  ubicacion: any;
  style = 'mapbox://styles/sunshine772/cla293z82000614qsh957irbj';
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

  buildMapCoords(longitud: number, latitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          center: [longitud, latitud],
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

  // iniciarEscuchaClick() {
  //   return new Promise<Coordenadas>((resolve) => {
  //     this.map.on('click', (e: any) => {
  //       this.coordenada.latitud = e.lngLat.lat;
  //       this.coordenada.longitud = e.lngLat.lng;
  //       this.coordenadasSubject.next(this.coordenada);
  //       resolve(this.coordenada);
  //     });
  //   });
  // }

  iniciarEscuchaClick(): Observable<Coordenadas> {
    return new Observable<Coordenadas>((observer) => {
      this.map.on('click', (e: any) => {
        this.coordenada.longitud = e.lngLat.lng;
        this.coordenada.latitud = e.lngLat.lat;
        observer.next(this.coordenada);
      });
    });
  }

  adicionarMedidor(medidores: any) {
    for (const medidor of medidores) {
      const el = document.createElement('div');
      el.style.border = 'white solid 1px';
      el.style.display = 'block';
      el.style.border = 'none';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.padding = '0';
      el.style.backgroundImage = `url('./assets/medidor.png')`;
      el.style.width = `1.5vw`;
      el.style.height = `3vh`;
      el.style.backgroundSize = '100%';

      this.puntos = new mapboxgl.Marker(el, {
        draggable: false,
      })
        .setLngLat([medidor.longitud, medidor.latitud])
        .addTo(this.map);
    }
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

      // this.ubicacion = new mapboxgl.Marker({
      //   draggable: false,
      //   color: '#ffb503',
      // })
      //   .setLngLat([longitud, latitud])
      //   .addTo(this.map);

      this.map.flyTo({
        center: [longitud, latitud],
        zoom: this.zoom,
        speed: 1.2,
        essential: true,
      });
    }
  }

  localizacion() {
    this.ubicacion = new mapboxgl.Marker({
      draggable: true,
      color: '#ffb503',
    })
      .setLngLat([this.longitud, this.latitud])
      .addTo(this.map);

    this.ubicacion.on('drag', () => {
      console.log(this.ubicacion.getLngLat());
    });
  }

  adicionarLugar() {
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

  ubicar(latitud: number, longitud: number) {
    this.map.flyTo({
      center: [longitud, latitud],
      zoom: 16,
    });
    new mapboxgl.Marker({
      color: '#ffb503',
    })
      .setLngLat([longitud, latitud])
      .addTo(this.map);
  }

  adicionarRuta() {
    this.map.on('click', (event) => {
      const coordinates: [number, number] = [
        event.lngLat.lng,
        event.lngLat.lat,
      ];

      this.coordinates.push(coordinates);
      console.log('Coordenadas:', this.coordinates);

      if (this.coordinates.length === 1) {
        this.marker = new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(this.map);
      } else {
        const coordinates = this.coordinates;
        const geojson: any = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          ],
        };

        if (this.map.getSource('route')) {
          (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData(
            geojson
          );
        } else {
          this.map.addSource('route', {
            type: 'geojson',
            data: geojson,
          });

          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
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
      }
    });
  }
  // adicionarRedElectrica() {

  //   for (const point of redElectrica) {
  //     const el = document.createElement('div');
  //     // el.style.backgroundImage = `url('./assets/power-line-icon.png')`; // Reemplaza con la URL de tu ícono
  //     el.style.width = '30px';
  //     el.style.height = '30px';

  //     new this.mapbox.Marker(el)
  //     .setLngLat([point.lng, point.lat])
  //     .addTo(this.map);
  //   }
  // }

  adicionarRedElectrica() {
    const redElectrica: [number, number][] = [
      [-65.19561006107449, -20.617144718413954],

      [-65.1966400293356, -20.61859071624818],

      [-65.19698335209002, -20.621643333250532],

      [-65.19801332035183, -20.624053250812267],

      [-65.19852830448241, -20.62646313022597],
      [-65.19938661136737, -20.62919428077329],
      [-65.20041657962923, -20.631604078792392],

      [-65.20230485477533, -20.633853189181977],

      [-65.20333482303715, -20.63562032402386],
      [-65.20470811405268, -20.63690550010874],
      [-65.2062530664451, -20.637387438341193],
      [-65.20745469608379, -20.637548084079384],

      [-65.20779801883818, -20.638672599496886],

      [-65.20779801883818, -20.640439678359186],

      [-65.20779801883818, -20.64188545488679],
      [-65.20796968021503, -20.64317057803953],
      [-65.2081413415919, -20.645258880003027],
      [-65.20882798709931, -20.646865246614837],

      [-65.21020127811553, -20.64815032768486],
      [-65.21157456913109, -20.649114131360932],

      [-65.21243287601537, -20.64975666374984],
      [-65.21329118290033, -20.652648025895502],

      [-65.21363450565406, -20.65457557010693],
      [-65.21363450565406, -20.656503089874008],

      [-65.21432115116218, -20.659876190641825],

      [-65.2146644739159, -20.66357045318695],
      [-65.21569444217772, -20.666461552518697],

      [-65.21638108768583, -20.669031372398408],

      [-65.21689607181641, -20.67111931903203],
      [-65.21826936283193, -20.673367844842105],

      [-65.21947099247063, -20.674813308138184],

      [-65.22015763797874, -20.676740571126288],

      [-65.22101594486301, -20.679149615455742],

      [-65.22170262147955, -20.681397987000295],

      [-65.22221760561081, -20.683646360574784],

      [-65.2230759124958, -20.684931130519757],
      [-65.2230759124958, -20.68509172599792],
      [-65.2230759124958, -20.686697671432967],
      [-65.2230759124958, -20.68717945174879],
      [-65.2230759124958, -20.690230691557886],
      [-65.22341923524951, -20.692960696211742],

      [-65.22479252626503, -20.69681473678284],
      [-65.22547917177246, -20.69970520293731],
      [-65.22599415590372, -20.70147157179747],
      [-65.22668080141116, -20.703719647856886],

      [-65.22736744691927, -20.70628883681863],
      [-65.22771080885659, -20.707894559466055],

      [-65.22753914747972, -20.711748220430778],

      [-65.22753914747972, -20.716886282603454],

      [-65.22753914747972, -20.71945524834581],
      [-65.22771080885659, -20.720900272430384],

      [-65.22805413161029, -20.72266639425591],
      [-65.2287407771184, -20.724914155882743],
      [-65.22959908400271, -20.72780408609121],
      [-65.23080071364139, -20.73037286663663],
      [-65.23234566603449, -20.73358378102293],
      [-65.23320397291877, -20.73518921267454],
      [-65.23389061842688, -20.73599192211495],
      [-65.23595055495053, -20.738560563710237],

      [-65.2364655390811, -20.739202717296195],
      [-65.23698052321168, -20.740647552901947],

      [-65.23732384596606, -20.74289504753078],
      [-65.23749550734291, -20.746908347749326],

      [-65.23698052321168, -20.748353109762377],

      [-65.23526390944241, -20.750761015780526],

      [-65.23492058668872, -20.753329406607065],

      [-65.2342339411806, -20.755255671097387],
      [-65.2342339411806, -20.756700353359918],
      [-65.23423394013793, -20.75830553029475],
      [-65.23389755206489, -20.760821917762897],

      [-65.23372935802838, -20.762237367304593],

      [-65.23372935802838, -20.762866451734155],

      [-65.2335611639919, -20.765854567013918],
      [-65.2328883878459, -20.770572523462036],
      [-65.2328883878459, -20.77387500530932],
      [-65.23272019380875, -20.776076619759237],

      [-65.23272019380875, -20.778120947296287],

      [-65.2328883878459, -20.78063700473311],
      [-65.23255199977224, -20.785040004357654],

      [-65.23238380573572, -20.78614073419763],
      [-65.22868353693077, -20.796990355907994],

      [-65.22901992500375, -20.799977795907196],

      [-65.22868353693077, -20.80658140067311],
      [-65.22851534289427, -20.81192696414577],
      [-65.22885173096726, -20.81805840646352],
      [-65.22868353693077, -20.823560770500052],

      [-65.2280107607841, -20.82937733681588],
      [-65.22817895482126, -20.83330732202137],
      [-65.22784256674758, -20.8386519372894],
      [-65.2276743727111, -20.842738867986554],
      [-65.22683340252864, -20.84635413724199],
      [-65.22599243234545, -20.851383932575985],

      [-65.22582423830895, -20.85374159124821],
      [-65.22431049197914, -20.85939982127475],
      [-65.2304170731774, -20.880997565255882],
      [-65.22991249106724, -20.89686862520594],
      [-65.23024887914092, -20.90739602621126],
      [-65.23024887914092, -20.920907726681634],

      [-65.2309216552869, -20.93206181738684],
      [-65.22907152088474, -20.941958413728486],

      [-65.2277259685921, -20.95216850209418],
      [-65.22823055070157, -20.96410556811024],
      [-65.22839874473807, -20.970073743846683],

      [-65.22773832185837, -20.986859325315535],

      [-65.22739499910469, -20.992629070890928],

      [-65.2272233377278, -20.998398593526957],
      [-65.2268800149741, -21.00432814831619],
      [-65.22550672395788, -21.009295972290232],

      [-65.22550672395788, -21.01506485060264],
      [-65.22447675569674, -21.021634690242053],

      [-65.22293180330367, -21.028524698844762],

      [-65.22070020540384, -21.03477350097421],
      [-65.22070020540384, -21.04262418857003],
      [-65.21967023714201, -21.052236711815155],

      [-65.21881193025705, -21.058003927838257],

      [-65.21743863924151, -21.069697874162628],

      [-65.21829694612647, -21.082672272741206],

      [-65.21537873754075, -21.104453976163484],

      [-65.21572206029447, -21.112461124386215],

      [-65.21555039891763, -21.122389388141627],

      [-65.21606538304816, -21.13423838135921],
      [-65.21606538304816, -21.14240402809513],
      [-65.2110872031166, -21.153450951478675],
      [-65.2121171713784, -21.16081510926449],
      [-65.21314720668633, -21.1692994504092],
      [-65.21194557704834, -21.179223905554863],

      [-65.21374802150602, -21.185466366763308],

      [-65.20525078625572, -21.186106610327343],
    ];

    const lineCoordinates: number[][] = [];
    const markerCoordinates: number[][] = [];

    for (const point of redElectrica) {
      lineCoordinates.push(point);
      markerCoordinates.push(point);
    }

    const lineFeatureCollection: any = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: lineCoordinates,
          },
        },
      ],
    };

    this.map.on('load', () => {
      this.map.addSource('redElectrica', {
        type: 'geojson',
        data: lineFeatureCollection,
      });

      this.map.addLayer({
        id: 'redElectrica',
        type: 'line',
        source: 'redElectrica',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FF0000',
          'line-width': 2,
        },
      });

      for (const markerCoordinate of markerCoordinates) {
        new mapboxgl.Marker()
          .setLngLat([markerCoordinate[0], markerCoordinate[1]])
          .addTo(this.map);
      }
    });
  }

  // // Arreglo de postes
  // postes: any[] = [
  //   { id_pos: 1, longitud: -65.20855688902002, latitud: -20.639868126745668 },
  //   { id_pos: 2, longitud: -65.20911256211355, latitud: -20.641385516450214 },
  //   { id_pos: 3, longitud: -65.20973200097161, latitud: -20.642502237405935 },
  //   { id_pos: 4, longitud: -65.21084334715806, latitud: -20.642152730202653 },
  //   { id_pos: 5, longitud: -65.2082198414022, latitud: -20.643363215158885 },

  //   // ... otros postes
  // ];

  // // Arreglo de líneas
  // lineas: any[] = [
  //   { id_lin: 1, nombre: 'Linea 1', inicio: 1, fin: 2 },
  //   { id_lin: 2, nombre: 'Linea 2', inicio: 2, fin: 3 },
  //   { id_lin: 3, nombre: 'Linea 3', inicio: 3, fin: 4 },
  //   { id_lin: 4, nombre: 'Linea 3', inicio: 3, fin: 5 },
  //   // ... otras líneas
  // ];

  markerLayers: mapboxgl.Marker[] = []; // Almacena las capas de marcadores aquí

  agregarPostes(postes: Postes[]): void {
    if (postes && postes.length > 0) {
      postes.forEach((poste: any) => {
        const marker = new mapboxgl.Marker({
          // color: '#ffb503',
        })
          .setLngLat([poste.coordenadas.longitud, poste.coordenadas.latitud])
          .addTo(this.map);

        this.markerLayers.push(marker);
      });
    }
  }

// Dentro del servicio de Mapa (mapa.service.ts)

agregarLineas(lineas: Lineas[], postes: Postes[]) {
  if (lineas && lineas.length > 0) {
    lineas.forEach((linea: Lineas) => {
      const inicio = postes.find((poste) => poste.id_pos === linea.inicio);
      const fin = postes.find((poste) => poste.id_pos === linea.fin);

      if (inicio && fin) {
        const coordinates = [
          [inicio.coordenadas.longitud, inicio.coordenadas.latitud],
          [fin.coordenadas.longitud, fin.coordenadas.latitud],
        ];

        const lineaGeojson: any = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
          properties: {}, // Puedes agregar propiedades aquí si es necesario
        };

        const sourceId = `linea-${linea.id_lin}`;
        const layerId = `linea-layer-${linea.id_lin}`;

        if (!this.map.getSource(sourceId)) {
          this.map.addSource(sourceId, {
            type: 'geojson',
            data: lineaGeojson,
          });

          this.map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#ff0000',
              'line-width': 2,
            },
          });
        }
      }
    });
  }
}


  // esAdyacente(poste: Postes, coordenada: Coordenadas): boolean {
  //   const distanciaMaxima = 0.01; // Ajusta esta distancia según tus necesidades

  //   const distancia = this.calcularDistancia(
  //     coordenada.latitud,
  //     coordenada.longitud,
  //     poste.coordenadas.latitud,
  //     poste.coordenadas.longitud
  //   );

  //   return distancia <= distanciaMaxima;
  // }

  markerAdyacente: mapboxgl.Marker | null = null;
  
  posteAdyacente(postes: Postes[], coordenada: Coordenadas): Postes[] {
    const postesAdyacentes: Postes[] = [];
    let distanciaMinima = Infinity;

    postes.forEach((poste) => {
      const distancia = this.calcularDistancia(
        coordenada.latitud,
        coordenada.longitud,
        poste.coordenadas.latitud,
        poste.coordenadas.longitud
      );

      if (distancia < distanciaMinima) {
        // Limpiamos el arreglo de postes adyacentes
        postesAdyacentes.length = 0;

        // Eliminamos el marcador del poste anterior si existe
        if (this.markerAdyacente) {
          this.markerAdyacente.remove();
        }

        // Agregamos un nuevo marcador del poste adyacente
        this.markerAdyacente = new mapboxgl.Marker({
          draggable: false,
          color: '#ff0000', // Cambia el color como desees
        })
          .setLngLat([poste.coordenadas.longitud, poste.coordenadas.latitud])
          .addTo(this.map);

        // Agregamos el poste actual como el más cercano
        postesAdyacentes.push(poste);
        distanciaMinima = distancia;
      } else if (distancia === distanciaMinima) {
        // Si la distancia es igual a la mínima, también lo agregamos
        postesAdyacentes.push(poste);
      }
    });

    return postesAdyacentes;
  }

  calcularDistancia(
    latitud1: any,
    longitud1: any,
    latitud2: any,
    longitud2: any
  ) {
    const radioTierraKm = 6371; // Radio promedio de la Tierra en kilómetros

    const latitudRadianes1 = this.gradosARadianes(latitud1);
    const latitudRadianes2 = this.gradosARadianes(latitud2);
    const diferenciaLatitudRadianes = this.gradosARadianes(latitud2 - latitud1);
    const diferenciaLongitudRadianes = this.gradosARadianes(
      longitud2 - longitud1
    );

    const a =
      Math.sin(diferenciaLatitudRadianes / 2) ** 2 +
      Math.cos(latitudRadianes1) *
        Math.cos(latitudRadianes2) *
        Math.sin(diferenciaLongitudRadianes / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanciaKm = radioTierraKm * c;
    return distanciaKm;
  }

  gradosARadianes(grados: any) {
    return (grados * Math.PI) / 180;
  }

  // // Función para agregar un nuevo punto y su línea adyacente
  // agregarNuevoPuntoYLinea() {
  //   this.map.on('click', (e) => {
  //     const nuevaLatitud = e.lngLat.lat;
  //     const nuevaLongitud = e.lngLat.lng;

  //     const nuevoPunto = {
  //       id_pos: this.postes.length + 1,
  //       longitud: nuevaLongitud,
  //       latitud: nuevaLatitud,
  //     };

  //     const puntoAdyacente: any = this.encontrarPuntoAdyacenteMasCercano(
  //       nuevaLatitud,
  //       nuevaLongitud
  //     );

  //     const nuevaLinea = {
  //       id_lin: this.lineas.length + 1,
  //       nombre: `Linea ${this.lineas.length + 1}`,
  //       inicio: nuevoPunto.id_pos,
  //       fin: puntoAdyacente.id_pos,
  //     };

  //     this.postes.push(nuevoPunto);
  //     this.lineas.push(nuevaLinea);

  //     this.actualizarMapa();
  //   });
  // }

  // // Función para encontrar el punto adyacente más cercano
  // encontrarPuntoAdyacenteMasCercano(latitud: any, longitud: any) {
  //   let puntoAdyacente;
  //   let distanciaMinima = Infinity;

  //   this.postes.forEach((poste) => {
  //     const distancia = this.calcularDistancia(
  //       latitud,
  //       longitud,
  //       poste.latitud,
  //       poste.longitud
  //     );
  //     if (distancia < distanciaMinima) {
  //       puntoAdyacente = poste;
  //       distanciaMinima = distancia;
  //     }
  //   });

  //   return puntoAdyacente;
  // }

  // calcularDistancia(
  //   latitud1: any,
  //   longitud1: any,
  //   latitud2: any,
  //   longitud2: any
  // ) {
  //   const radioTierraKm = 6371; // Radio promedio de la Tierra en kilómetros

  //   const latitudRadianes1 = this.gradosARadianes(latitud1);
  //   const latitudRadianes2 = this.gradosARadianes(latitud2);
  //   const diferenciaLatitudRadianes = this.gradosARadianes(latitud2 - latitud1);
  //   const diferenciaLongitudRadianes = this.gradosARadianes(
  //     longitud2 - longitud1
  //   );

  //   const a =
  //     Math.sin(diferenciaLatitudRadianes / 2) ** 2 +
  //     Math.cos(latitudRadianes1) *
  //       Math.cos(latitudRadianes2) *
  //       Math.sin(diferenciaLongitudRadianes / 2) ** 2;

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   const distanciaKm = radioTierraKm * c;
  //   return distanciaKm;
  // }

  // gradosARadianes(grados: any) {
  //   return (grados * Math.PI) / 180;
  // }

  // actualizarMapa() {
  //   // const capasExistentes = this.map.getStyle().layers;
  //   // capasExistentes.forEach((capa: any) => {
  //   //   if (capa.id.startsWith('linea-')) {
  //   //     this.map.removeLayer(capa.id);
  //   //     this.map.removeSource(capa.id);
  //   //   }
  //   // });

  //   // this.agregarMarcadores();
  //   // this.agregarLineas();
  // }
}
