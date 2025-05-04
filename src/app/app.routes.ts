import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './services/authguard.service';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { OwnerComponent } from './pages/owner/owner.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' 
    },
    {
        path: 'auth/callback', 
        component: AuthCallbackComponent

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
    },
    {
        path: "owner",
        component: OwnerComponent,
        canActivate:[AuthGuard]
    }

];
