import { Component } from '@angular/core';
import { MapaService } from '../../services/mapa/mapa.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent {
  // constructor(private mapaService: MapaService) {}

  // ngOnInit(): void {
  //   this.mostrarMapa();
  // }

  // mostrarMapa() {
  //   this.mapaService
  //     .buildMap()
  //     .then((data) => {
  //       console.log('ok ');

  //       // this.mapaService.adicionarRuta();
  //       // this.mapaService.adicionarRedElectrica();
  //       this.mapaService.agregarMarcadores();
  //       this.mapaService.agregarLineas();


  //       this.mapaService.coords.subscribe((res) => {});
  //     })
  //     .catch((error) => {
  //       console.log('error ' ,error);
  //     });
  // }
}
