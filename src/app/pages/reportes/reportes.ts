import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FiltrosComponent, FiltrosValues } from '../../components/filtros/filtros';

interface ReporteMascota {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato' | 'Otro';
  estado: 'Perdido' | 'Encontrado';
  fecha: string;
  zona: string;
  descripcion: string;
  imagenUrl: string;
  colorPrincipal: string;
}

@Component({
  selector: 'app-reportes',
  imports: [NgOptimizedImage, ReactiveFormsModule, FiltrosComponent],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly isAuthenticated = this.auth.isAuthenticated;
  drawerAbierto = signal(false);

  private readonly reportesSignal = signal<ReporteMascota[]>([
    {
      id: 1,
      nombre: 'Luna',
      especie: 'Perro',
      estado: 'Perdido',
      fecha: '2026-03-01',
      zona: 'Barrio Centro, Tandil',
      descripcion:
        'Perra mediana, muy sociable, se asusta con los ruidos fuertes. Lleva collar rojo.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s',
      colorPrincipal: 'Marrón y blanco',
    },
    {
      id: 2,
      nombre: 'Milo',
      especie: 'Gato',
      estado: 'Encontrado',
      fecha: '2026-03-05',
      zona: 'Parque Independencia',
      descripcion: 'Gato joven, de ojos verdes. Muy curioso, se deja agarrar sin problemas.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s',
      colorPrincipal: 'Gris atigrado',
    },
    {
      id: 3,
      nombre: 'Kira',
      especie: 'Perro',
      estado: 'Perdido',
      fecha: '2026-03-07',
      zona: 'Zona Universidad',
      descripcion: 'Perra grande tipo labrador, muy cariñosa. Microchip registrado.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s', //'/mock-reportes/kira-perro.jpg'
      colorPrincipal: 'Negro',
    },
    {
      id: 4,
      nombre: 'Nala',
      especie: 'Gato',
      estado: 'Perdido',
      fecha: '2026-03-08',
      zona: 'Villa Italia',
      descripcion:
        'Gata adulta esterilizada, suele quedarse cerca de casas. Llevaba collar celeste.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s',
      colorPrincipal: 'Blanco y naranja',
    },
    {
      id: 5,
      nombre: 'Rocky',
      especie: 'Perro',
      estado: 'Encontrado',
      fecha: '2026-03-10',
      zona: 'Terminal de ómnibus',
      descripcion:
        'Perro tipo mestizo, muy juguetón. Tenía correa azul pero sin chapa identificatoria.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s',
      colorPrincipal: 'Marrón claro',
    },
    {
      id: 6,
      nombre: 'Lola',
      especie: 'Otro',
      estado: 'Perdido',
      fecha: '2026-03-11',
      zona: 'Plaza San Martín',
      descripcion: 'Coneja enana doméstica, muy mansa. Se escapó del patio de la casa.',
      imagenUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmPuJHnKrhzig-NnkDWTI_beyRxqKuS45H5A&s',
      colorPrincipal: 'Blanco',
    },
  ]);

  protected readonly reportes = this.reportesSignal.asReadonly();

  toggleDrawer(): void {
    this.drawerAbierto.update((v) => !v);
  }

  onFiltrosAplicados(filtros: FiltrosValues): void {
    console.log('Filtros aplicados (reportes):', filtros);
    this.drawerAbierto.set(false);
  }

  private nextId = 7;

  protected readonly reporteForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    especie: <ReporteMascota['especie'] | ''>'',
    estado: <ReporteMascota['estado'] | ''>'',
    fecha: ['', [Validators.required]],
    zona: ['', [Validators.required]],
    colorPrincipal: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    imagenUrl: ['', [Validators.required]],
  });

  protected onAgregarReporte(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched();
      return;
    }

    const value = this.reporteForm.getRawValue();

    const nuevoReporte: ReporteMascota = {
      id: this.nextId++,
      nombre: value.nombre,
      especie: (value.especie || 'Otro') as ReporteMascota['especie'],
      estado: (value.estado || 'Perdido') as ReporteMascota['estado'],
      fecha: value.fecha,
      zona: value.zona,
      colorPrincipal: value.colorPrincipal,
      descripcion: value.descripcion,
      imagenUrl: value.imagenUrl,
    };

    this.reportesSignal.update((actuales) => [nuevoReporte, ...actuales]);

    this.reporteForm.reset({
      nombre: '',
      especie: '',
      estado: '',
      fecha: '',
      zona: '',
      colorPrincipal: '',
      descripcion: '',
      imagenUrl: '',
    });
  }
}
