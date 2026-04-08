import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

type EspecieMascota = 'Perro' | 'Gato' | 'Otro';

interface Mascota {
  id: number;
  nombre: string;
  especie: EspecieMascota;
  edadAproximada: string;
  colorPrincipal: string;
  descripcion: string;
  fotoUrl: string;
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

  private readonly mascotasSignal = signal<Mascota[]>([
    {
      id: 1,
      nombre: 'Luna',
      especie: 'Perro',
      edadAproximada: '2 años',
      colorPrincipal: 'Marrón y blanco',
      descripcion: 'Perra mediana, muy sociable y juguetona. Lleva collar rojo.',
      fotoUrl: 'https://cdn.shopify.com/s/files/1/0268/6861/files/Dog_Breeds_d405d8cc-bddf-4428-8359-5ea0afe46fa3_480x480.jpg?v=1656165310',
    },
    {
      id: 2,
      nombre: 'Milo',
      especie: 'Gato',
      edadAproximada: '1 año',
      colorPrincipal: 'Gris atigrado',
      descripcion: 'Gato joven de interior, muy curioso. Está identificado con microchip.',
      fotoUrl: '/mock-mascotas/milo.jpg',
    },
  ]);

  readonly mascotas = computed(() => this.mascotasSignal());

  private nextId = 3;

  readonly mascotaForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    especie: <EspecieMascota | ''>'',
    edadAproximada: ['', [Validators.required]],
    colorPrincipal: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fotoUrl: ['', [Validators.required]],
  });

  readonly mascotaAEliminar = signal<Mascota | null>(null);

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/login');
    }
  }

  onAgregarMascota(): void {
    if (this.mascotaForm.invalid) {
      this.mascotaForm.markAllAsTouched();
      return;
    }

    const value = this.mascotaForm.getRawValue();

    const nuevaMascota: Mascota = {
      id: this.nextId++,
      nombre: value.nombre,
      especie: (value.especie || 'Otro') as EspecieMascota,
      edadAproximada: value.edadAproximada,
      colorPrincipal: value.colorPrincipal,
      descripcion: value.descripcion,
      fotoUrl: value.fotoUrl,
    };

    this.mascotasSignal.update((actuales) => [nuevaMascota, ...actuales]);
    this.mascotaForm.reset({
      nombre: '',
      especie: '',
      edadAproximada: '',
      colorPrincipal: '',
      descripcion: '',
      fotoUrl: '',
    });

    Swal.fire({
      title: '¡Mascota registrada!',
      text: `${nuevaMascota.nombre} se agregó a tus mascotas con éxito.`,
      icon: 'success',
      backdrop: 'rgba(0,0,0,0.7)',
      customClass: {
        popup: 'rounded-3xl'
      },
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3b82f6',
      timer: 4000,
      timerProgressBar: true
    });
  }

  onEliminarMascotaRequest(mascota: Mascota): void {
    this.mascotaAEliminar.set(mascota);
  }

  confirmarEliminacion(): void {
    const mascota = this.mascotaAEliminar();
    if (mascota) {
      this.mascotasSignal.update((actuales) => actuales.filter((m) => m.id !== mascota.id));
      this.mascotaAEliminar.set(null);
    }
  }

  cancelarEliminacion(): void {
    this.mascotaAEliminar.set(null);
  }

  
}

