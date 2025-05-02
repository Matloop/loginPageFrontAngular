import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/authguard.service';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' 
    },
    {

        path: "login",
        component : LoginComponent,
    },
    {
        path: "signup",
        component : SignUpComponent,
    },
    {
        path: "user",
        component : UserComponent,
        canActivate:[AuthGuard]
    }
];
