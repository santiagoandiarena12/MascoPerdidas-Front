import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
      fotoUrl: '/mock-mascotas/luna.jpg',
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
  }

  onEliminarMascota(id: number): void {
    this.mascotasSignal.update((actuales) => actuales.filter((m) => m.id !== id));
  }
}

