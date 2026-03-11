import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // La ruta principal carga el mapa
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los manda al inicio
];