import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

export interface FiltrosValues {
  tipo: 'perdidas' | 'encontradas';
  especie: string;
  sexo: string;
  distancia: number;
}

@Component({
  selector: 'app-filtros',
  imports: [ReactiveFormsModule],
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosComponent {
  private readonly fb = inject(FormBuilder);

  filtrosAplicados = output<FiltrosValues>();

  tipoSeleccionado = signal<'perdidas' | 'encontradas'>('perdidas');

  form = this.fb.group({
    especie: [''],
    sexo: [''],
    distancia: [5],
  });

  readonly distancias = [1, 2, 5, 10];

  seleccionarTipo(tipo: 'perdidas' | 'encontradas'): void {
    this.tipoSeleccionado.set(tipo);
  }

  aplicarFiltros(): void {
    const values = this.form.getRawValue();
    this.filtrosAplicados.emit({
      tipo: this.tipoSeleccionado(),
      especie: values.especie ?? '',
      sexo: values.sexo ?? '',
      distancia: values.distancia ?? 5,
    });
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado.set('perdidas');
    this.form.reset({ especie: '', sexo: '', distancia: 5 });
  }
}
