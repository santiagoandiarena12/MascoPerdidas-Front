import { AfterViewInit, Component, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('mapaMascotas', { static: true }) private mapContainer!: ElementRef<HTMLElement>;
  private map?: any;

  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  private async iniciarMapa(): Promise<void> {
    // Evitamos cargar Leaflet durante SSR (no hay window/document en Node)
    if (typeof window === 'undefined' || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const L = (await import('leaflet')) as typeof import('leaflet');

    // Inicializamos el mapa en el <div> referenciado por ViewChild
    // Centramos las coordenadas en Tandil y le damos un zoom de 13
    this.map = L.map(this.mapContainer.nativeElement).setView([-37.32167, -59.13316], 13);

    // 2. Agregamos la "capa" visual del mapa (usamos OpenStreetMap que es gratis)   
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Usamos un circleMarker en lugar de icono predeterminado para evitar problemas con rutas de assets
    L.circleMarker([-37.32167, -59.13316], {
      radius: 10,
      color: '#e63946',
      fillColor: '#e63946',
      fillOpacity: 0.8,
    })
      .bindPopup('¡Acá va a estar el centro de operaciones!')
      .addTo(this.map);
  }
}