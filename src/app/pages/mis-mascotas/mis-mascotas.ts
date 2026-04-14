import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MascotasService } from '../../services/mascotas.service';
import Swal from 'sweetalert2';

type EspecieMascota = 'Perro' | 'Gato' | 'Otro';

// Adaptá esta interfaz si tu backend de Spring manda propiedades distintas (ej: en vez de colorPrincipal manda 'color')
export interface Mascota {
  id?: number;
  nombre: string;
  especie: EspecieMascota;
  raza?: string;
  fotoUrl?: string;
}

@Component({
  selector: 'app-mis-mascotas',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './mis-mascotas.html',
  styleUrls: ['./mis-mascotas.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisMascotasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly mascotasService = inject(MascotasService);

  private readonly mascotasSignal = signal<Mascota[]>([]);

  readonly mascotas = computed(() => this.mascotasSignal());

  // Eliminamos el nextId local porque eso ahora es responsabilidad del Backend (Base de datos ID autoincremental)
  // ...
  readonly mascotaForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    especie: <EspecieMascota | ''>'',
    raza: ['', [Validators.maxLength(50)]],
    fotoUrl: ['', [Validators.maxLength(255)]],
  });

  readonly mascotaAEliminar = signal<Mascota | null>(null);
  readonly mostrarFormulario = signal(false);
  readonly estaCargando = signal(true); // Manejo de estado de carga

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.estaCargando.set(true);
    // Llamada HTTP al backend usando los observables de RxJS
    this.mascotasService.getMascotas().subscribe({
      next: (mascotasDelBack: any) => {
        // En un mundo ideal: `mascotasDelBack` debería ya matchar la interfaz `Mascota`
        this.mascotasSignal.set(mascotasDelBack);
        this.estaCargando.set(false);
      },
      error: (err) => {
        console.error('No se pudo traer las mascotas del backend, quizas el back esta apagado', err);
        
        // Podes mockear la data en caso que de fallo si estas probando el front solo.
        this.mascotasSignal.set([
          { id: 1, nombre: 'Luna (Mock fallo conexión)', especie: 'Perro', raza: 'Caniche', fotoUrl: '/mock-mascotas/milo.jpg' }
        ]);
        this.estaCargando.set(false);
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
  }

  onAgregarMascota(): void {
    if (this.mascotaForm.invalid) {
      this.mascotaForm.markAllAsTouched();
      return;
    }

    const value = this.mascotaForm.getRawValue();

    // Notar que NO pasamos ID, ya que la Base de Datos es quien debe generarlo.
    const nuevaMascota = {
      nombre: value.nombre,
      especie: (value.especie || 'Otro') as EspecieMascota,
      raza: value.raza,
      fotoUrl: value.fotoUrl,
    };

    // Le pegamos a Spring Boot usando el método del service (post)
    this.mascotasService.crearMascota(nuevaMascota).subscribe({
      next: (mascotaConfirmadaDelBack) => {
        // En el `next`, metemos al array lo que la API nos devuelve (y ahora SÍ viene con el .id que generó MySQL/Postgres etc)
        this.mascotasSignal.update((actuales) => [mascotaConfirmadaDelBack as Mascota, ...actuales]);
        
        this.mascotaForm.reset();
        this.mostrarFormulario.set(false);

        Swal.fire({
          title: '¡Mascota registrada!',
          text: `${mascotaConfirmadaDelBack.nombre} se agregó a tus mascotas con éxito en la base de datos.`,
          icon: 'success',
          backdrop: 'rgba(0,0,0,0.7)',
          customClass: { popup: 'rounded-3xl' },
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3b82f6',
          timer: 4000,
          timerProgressBar: true
        });
      },
      error: () => {
        Swal.fire('Error', 'Hubo un error conectando con el servidor', 'error');
      }
    });
  }

  onEliminarMascotaRequest(mascota: Mascota): void {
    this.mascotaAEliminar.set(mascota);
  }

  confirmarEliminacion(): void {
    const mascota = this.mascotaAEliminar();
    
    if (mascota && mascota.id) {
      // Disparamos peticion HTTP DELETE /api/mascotas/:id
      this.mascotasService.eliminarMascota(mascota.id).subscribe({
        next: () => {
          this.mascotasSignal.update((actuales) => actuales.filter((m) => m.id !== mascota.id));
          this.mascotaAEliminar.set(null);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar la mascota. Verificá la base de datos.', 'error');
          this.mascotaAEliminar.set(null);
        }
      });
    }
  }

  cancelarEliminacion(): void {
    this.mascotaAEliminar.set(null);
  }

  
}

