import {
  AfterViewInit,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FiltrosComponent, FiltrosValues } from '../../components/filtros/filtros';

@Component({
  selector: 'app-home',
  imports: [FiltrosComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('mapaMascotas', { static: true }) private mapContainer!: ElementRef<HTMLElement>;
  private map?: any;

  drawerAbierto = signal(false);

  ngAfterViewInit(): void {
    this.iniciarMapa();
  }

  toggleDrawer(): void {
    this.drawerAbierto.update((v) => !v);
  }

  onFiltrosAplicados(filtros: FiltrosValues): void {
    const centro = this.map?.getCenter();
    console.log('Filtros aplicados:', {
      ...filtros,
      coordenadas: centro ? { lat: centro.lat, lng: centro.lng } : null,
    });
    this.drawerAbierto.set(false);
  }

  private async iniciarMapa(): Promise<void> {
    if (typeof window === 'undefined' || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const L = (await import('leaflet')) as typeof import('leaflet');

    this.map = L.map(this.mapContainer.nativeElement).setView([-37.32167, -59.13316], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.circleMarker([-37.32167, -59.13316], {
      radius: 10,
      color: '#e63946',
      fillColor: '#e63946',
      fillOpacity: 0.8,
    })
      .bindPopup('¡Aca va a estar el centro de operaciones!')
      .addTo(this.map);
  }
}
