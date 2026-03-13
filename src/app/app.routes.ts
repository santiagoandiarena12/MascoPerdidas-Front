import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { ReportesComponent } from './pages/reportes/reportes';
import { RegisterComponent } from './pages/register/register';
import { MisMascotasComponent } from './pages/mis-mascotas/mis-mascotas';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // La ruta principal carga el mapa
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reportes', component: ReportesComponent },
  { path: 'mis-mascotas', component: MisMascotasComponent },
  { path: '**', redirectTo: '' } // Si escriben una URL que no existe, los manda al inicio
];